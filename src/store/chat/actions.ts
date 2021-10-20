import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { ChatStateInterface } from "./state";

import * as _l from "lodash";
import helpers from "boot/helpers/helpers";

import Conversation from "src/store/models/Conversation";
import Message from "src/store/models/Message";
import ConversationSession from "src/store/models/ConversationSession";

const actions: ActionTree<ChatStateInterface, StateInterface> = {
    storeClientInitiateConvInfo(context, payload) {
        context.commit("storeClientInitiateConvInfo", payload);

        const conv = payload.data.conv_data;

        context.commit("updateConversation", {
            conv_id: conv.id,
            conversation: _l.pick(conv, [
                "id",
                "users_only",
                "type",
                "closed_at",
                "created_by_id",
                "closed_by_id",
                "created_at",
            ]),
            sessions: conv.conversation_sessions,
            chat_department: conv.chat_department,
            ai_is_replying: conv.ai_is_replying,
            caller: "storeClientInitiateConvInfo",
        });
    },

    async storeNewChatFromClient(context, convInfo) {
        const convData = convInfo.conv_data;

        const obj = {
            conv_id: convData.id,
            conversation: _l.pick(convData, [
                "id",
                "users_only",
                "type",
                "closed_at",
                "created_by_id" /*'closed_by_id'*/,
                "created_at",
            ]),
            sessions: convData.conversation_sessions,
            chat_department: convData.chat_department,
            notify_status: convInfo.notify, // of this action if notify then true
            original_data: { conversation: convInfo.conv_data },
            caller: "storeNewChatFromClient",
        };

        context.commit("updateConversation", obj);

        if (convData.log_message) {
            // context.commit("updateConversation", { conv_id: convData.id, message: convData.log_message });

            await Message.insert({ data: convData.log_message });
        }

        if (
            localStorage.getItem("ec_not_in_tabs") &&
            window.$browser_tab_id === localStorage.getItem("ec_last_visited_tab")
        ) {
            const clientInfo = _l.find(obj.sessions, (convSes: any) => !convSes.socket_session.user);

            const notification = new Notification(`New chat from ${clientInfo?.socket_session.init_name}`, {
                body: `Department : ${obj.chat_department.display_name}`,
            });

            notification.onclick = function () {
                window.focus();
                window.router.push({
                    name: "chats",
                    params: { conv_id: obj.conv_id },
                });
                this.close();
            };
        }
    },

    updateConvSesInfo(context, data) {
        context.commit("updateConvSesInfo", data);

        const profile = context.rootGetters["auth/profile"];

        if (data.action === "chat_transfer_sent" && profile.online_status === "online") {
            if (window.$browser_tab_id === localStorage.getItem("ec_current_visiting_tab")) {
                helpers.notifications().reqOne.play().then();
            }

            if (
                localStorage.getItem("ec_not_in_tabs") &&
                window.$browser_tab_id === localStorage.getItem("ec_last_visited_tab")
            ) {
                const convObj = context.getters["conversationInfo"](data.conv_id);

                const notification = new Notification(
                    `Chat transfer request from ${data.original_payload?.agent_info?.user_meta?.display_name}`,
                    {
                        body: `Department : ${convObj.chat_department.display_name}`,
                    }
                );

                notification.onclick = function () {
                    window.focus();
                    window.router.push({
                        name: "chats",
                        params: { conv_id: data.conv_id },
                    });
                    this.close();
                };
            }
        }
    },

    async updateConvState(context, convSesInfo) {
        context.commit("updateConversation", {
            conv_id: convSesInfo.conversation_id,
            session: convSesInfo,
            caller: "updateConvState",
        });

        if (convSesInfo.log_message) {
            // context.commit("updateConversation", {
            //     conv_id: convSesInfo.conversation_id,
            //     message: convSesInfo.log_message,
            // });

            await Message.insert({ data: convSesInfo.log_message });
        }
    },
    async updateConvStateToClosed(context, convInfo) {
        context.commit("updateConversation", {
            conv_id: convInfo.id,
            closed_by: convInfo.closed_by,
            // not destructuring convInfo. decision for later
            closed_at: convInfo.closed_at,
            closed_by_id: convInfo.closed_by_id,
            closed_reason: convInfo.closed_reason,
            sessions: convInfo.conversation_sessions, // not sending now
            caller: "updateConvStateToClosed",
            original_data: { conversation: convInfo },
        });

        if (convInfo.log_message) {
            // context.commit("updateConversation", {
            //     conv_id: convInfo.id,
            //     message: convInfo.log_message,
            // });

            await Message.insert({ data: convInfo.log_message });
        }
    },
    async updateConversationSession(context, conversationSession) {
        await ConversationSession.update({
            where: conversationSession.id,
            data: conversationSession,
        });
    },

    // get client conversation messages from db
    // async getClientConvMessages(context, payload) {
    //     const getConvStateInfo = window.socketSessionApi.get(`conversations/${payload.convId}/sessions`),
    //         getConvMessages = window.socketSessionApi.get(`conversations/${payload.convId}/messages`);
    //
    //     return await context.dispatch('storeConvMessages', { getConvStateInfo, getConvMessages });
    // },

    // store conversation messages into state, so that getters can get the result
    getConvMessages(context, payload) {
        return new Promise((resolve, reject) => {
            const callerApi = payload.client_page ? window.socketSessionApi : window.api;

            let current_page = 0;

            const conversationInfo = context.getters["conversationInfo"](payload.convId);

            let callConvId = payload.convId;

            // get current_loading_conv_info if has
            if (
                conversationInfo.hasOwnProperty("current_loading_conv_info") &&
                conversationInfo.current_loading_conv_info
            ) {
                callConvId = conversationInfo.current_loading_conv_info.conv_id;
            }

            // get info which one we need
            const callConvInfo = context.getters["conversationInfo"](callConvId);

            // also get the info which we need
            if (callConvInfo && callConvInfo.pagination_meta) {
                current_page = callConvInfo.pagination_meta.current_page;
            }

            // call next conv_id so that we can get prev data
            callerApi
                .get(`conversations/${callConvId}/messages`, {
                    params: {
                        p: current_page + 1,
                        pp: 25,
                    },
                })
                .then((res: any) => {
                    const conv = res.data.conversation.data;
                    const pagination = res.data.conversation.pagination;

                    if (!conv.messages.length) {
                        pagination.current_page = current_page; // reset to the previous pagination so that +1 turns valid
                    }

                    // conv.current_page = payload.page || 1; // now only for temp & test

                    context.commit("updateConversation", {
                        conv_id: conv.id,
                        conversation: _l.pick(conv, [
                            "id",
                            "users_only",
                            "type",
                            "closed_at",
                            "closed_reason",
                            "created_by_id",
                            // 'closed_by_id',
                            "current_page",
                            "created_at",
                        ]),
                        sessions: conv.conversation_sessions,
                        chat_department: conv.chat_department,
                        // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                        // if later we implement other way then review this
                        messages: conv.messages,
                        ai_is_replying: conv.ai_is_replying,
                        closed_by: conv.closed_by,
                        closed_at: conv.closed_at,
                        closed_reason: conv.closed_reason,
                        rating: conv.conversation_rating,
                        pagination_meta: pagination,
                        caller: "getConvMessages",
                        original_data: { conversation: conv },
                    });

                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // get chat requests form db
    async getChatRequests(context) {
        try {
            const chatRequestRes = await window.api.get("conversations/requests/list");

            const chatRequests = chatRequestRes.data;
            // console.log('chat requests', chatRequests);

            for (const request of chatRequests) {
                await Conversation.insert({ data: request }).then((c) => c);
                await Message.insert({ data: request.messages[0] });

                context.commit("updateConversation", {
                    conv_id: request.id,
                    conversation: _l.pick(request, [
                        "id",
                        "users_only",
                        "type",
                        "closed_at",
                        "created_by_id",
                        // 'closed_by_id',
                        "created_at",
                    ]),
                    sessions: request.conversation_sessions,
                    chat_department: request.chat_department,
                    // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                    // if later we implement other way then review this
                    message: request.messages[0],
                    ai_is_replying: request.ai_is_replying,
                    closed_by: request.closed_by,
                    closed_at: request.closed_at,
                    caller: "getChatRequests",
                });
            }
        } catch (e) {
            return e; // actually throw error
        }
    },
    // getOtherJoinedChats form db
    async getOtherJoinedChats(context) {
        try {
            const convsRes = await window.api.get("conversations/joined");

            const convs = convsRes.data || [];

            // console.log('other joined chats', convs);

            for (const conv of convs) {
                await Conversation.insert({ data: conv });
                await Message.insert({ data: conv.messages[0] });

                context.commit("updateConversation", {
                    conv_id: conv.id,
                    conversation: _l.pick(conv, [
                        "id",
                        "users_only",
                        "type",
                        "closed_at",
                        "created_by_id",
                        // 'closed_by_id',
                        "created_at",
                    ]),
                    sessions: conv.conversation_sessions,
                    chat_department: conv.chat_department,
                    // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                    // if later we implement other way then review this
                    message: conv.messages[0],
                    ai_is_replying: conv.ai_is_replying,
                    closed_by: conv.closed_by,
                    closed_at: conv.closed_at,
                    caller: "getOtherJoinedChats",
                });
            }
        } catch (e) {
            return e; //actually throw error
        }
    },
    // getJoinedChatsWithMe form db
    async getJoinedChatsWithMe(context) {
        try {
            const convsRes = await window.api.get("conversations/joined/me");

            const convs = convsRes.data || [];
            // console.log('my joined chats', convs);

            for (const request of convs) {
                await Conversation.insert({ data: request }).then((c) => c);
                await Message.insert({ data: request.messages });

                context.commit("updateConversation", {
                    conv_id: request.id,
                    conversation: _l.pick(request, [
                        "id",
                        "users_only",
                        "type",
                        "closed_at",
                        "created_by_id",
                        // 'closed_by_id',
                        "created_at",
                    ]),
                    sessions: request.conversation_sessions,
                    chat_department: request.chat_department,
                    // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                    // if later we implement other way then review this
                    messages: request.messages,
                    ai_is_replying: request.ai_is_replying,
                    closed_by: request.closed_by,
                    closed_at: request.closed_at,
                    caller: "getJoinedChatsWithMe",
                });
            }
        } catch (e) {
            return e; // actually throw error
        }
    },

    // store message which came from socket events
    async storeMessage(context, messageRes) {
        const tempConv = messageRes.conversation;

        const obj = {
            conv_id: tempConv.id,
            conversation: _l.pick(tempConv, [
                "id",
                "users_only",
                "type",
                "closed_at",
                "created_by_id" /*'closed_by_id'*/,
                "created_at",
            ]),
            message: _l.omit(messageRes, ["conversation"]),
            ai_is_replying: messageRes.ai_is_replying,
            sessions: tempConv.conversation_sessions,
            chat_department: tempConv.chat_department,
            closed_by: tempConv.closed_by,
            closed_at: tempConv.closed_at,
            from: "socket",
            caller: "storeMessage",
        };

        context.commit("updateConversation", obj);

        if (obj.message.temp_id) {
            await Message.delete(obj.message.temp_id);
        }

        await Message.insert({ data: obj.message });

        const conversationStatusForMe = context.getters["conversationStatusForMe"](
            messageRes.conversation_id,
            helpers.getMySocketSessionId()
        );

        const profile = context.rootGetters["auth/profile"];

        if (
            messageRes.hasOwnProperty("socket_event") &&
            messageRes.socket_event === "ec_msg_from_user" &&
            messageRes.caller_page === "web-chat"
        ) {
            await helpers.notifications().replyOne.play();
        }

        if (profile.online_status === "online" && conversationStatusForMe === "joined") {
            if (messageRes.hasOwnProperty("socket_event") && messageRes.socket_event === "ec_msg_from_user") {
                await helpers.notifications().replyOne.play();
            }

            if (
                messageRes.hasOwnProperty("socket_event") &&
                messageRes.socket_event === "ec_msg_from_client" &&
                !messageRes.init_message_from_client
            ) {
                await helpers.notifications().replyTwo.play();

                if (
                    localStorage.getItem("ec_not_in_tabs") &&
                    window.$browser_tab_id === localStorage.getItem("ec_last_visited_tab")
                ) {
                    const clientInfo = _l.find(obj.sessions, (convSes: any) => !convSes.socket_session.user);

                    const notification = new Notification(`New message from ${clientInfo?.socket_session.init_name}`, {
                        body: obj.message.msg,
                    });

                    notification.onclick = function () {
                        window.focus();
                        window.router.push({
                            name: "chats",
                            params: { conv_id: obj.conv_id },
                        });
                        this.close();
                    };
                }
            }
        }
    },

    updateTypingState(context, typingObj) {
        return new Promise((resolve) => {
            context.commit("updateTypingState", typingObj);
            resolve(true);
        });
    },

    // get users
    getUsers(context) {
        return new Promise((resolve) => {
            const getMyConvWithUsers = window.socketSessionApi.get("conversations/user-to-user/me");
            const getUsers = window.api.get("users/active");

            Promise.all([getMyConvWithUsers, getUsers]).then(async ([myConvWithUsers, users]) => {
                // collect convSessions array
                myConvWithUsers.data.forEach((conv: any) => {
                    Conversation.insert({ data: conv });

                    context.commit("updateConversation", {
                        conv_id: conv.id,
                        conversation: _l.pick(conv, [
                            "id",
                            "users_only",
                            "type",
                            "closed_at",
                            "created_by_id",
                            // 'closed_by_id',
                            "created_at",
                        ]),
                        sessions: conv.conversation_sessions,
                        chat_department: conv.chat_department,
                        // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                        // if later we implement other way then review this
                        messages: conv.messages,
                        ai_is_replying: conv.ai_is_replying,
                        closed_by: conv.closed_by,
                        closed_at: conv.closed_at,
                        caller: "getUsers",
                    });
                });

                const convSessions = _l
                    .cloneDeep(myConvWithUsers.data)
                    .map((conv: any) => {
                        return conv.conversation_sessions;
                    })
                    .flat();

                // set agent conversation_id
                const chatUsers = users.data.map((user: any) => {
                    const convSession = convSessions.find(
                        (convSession: any) => convSession.socket_session_id == user.socket_session.id
                    );

                    if (convSession) {
                        user.conversation_id = convSession.conversation_id;
                    }

                    return user;
                });

                for (const chatUser of chatUsers) {
                    if (chatUser?.user_meta?.attachment?.id) {
                        try {
                            const imgRes = await window.api.get(`attachments/${chatUser.user_meta.attachment.id}`, {
                                responseType: "arraybuffer",
                            });

                            chatUser.user_meta.attachment.src = URL.createObjectURL(
                                new Blob([imgRes.data], { type: imgRes.headers["content-type"] })
                            );
                        } catch (e) {}
                    }
                }

                context.commit("storeUsers", chatUsers);

                resolve(chatUsers);
            });
        });
    },

    // update online users
    updateOnlineUsers(context, socketUsers) {
        return new Promise((resolve) => {
            context.commit("updateOnlineUsers", socketUsers);
            resolve(true);
        });
    },

    clearClientChatInitiate(context) {
        context.commit("clearClientChatInitiate");
    },

    updateConvRating(context, convRatingInfo) {
        return new Promise((resolve) => {
            context.commit("updateConversation", {
                conv_id: convRatingInfo.conversation_id,
                rating: convRatingInfo,
                caller: "updateConvRating",
            });
            resolve(true);
        });
    },

    updateConvMessagesCurrentPage(context, convPaginationInfo) {
        return new Promise((resolve) => {
            context.commit("updateConversation", {
                conv_id: convPaginationInfo.conv_id,
                pagination_meta: convPaginationInfo.pagination_meta,
                caller: "updateConvMessagesCurrentPage",
            });
            resolve(true);
        });
    },

    updateConvMessagesAutoScrollToBottom(context, scrollInfo) {
        // const storeScrollInfo = context.state.conversations[payload.conv_id]?.scroll_info;

        return new Promise((resolve) => {
            context.commit("updateConversation", {
                conv_id: scrollInfo.conv_id,
                scroll_info: scrollInfo,
                // scroll_info: { ...storeScrollInfo, ...payload },
                caller: "updateConvMessagesAutoScrollToBottom",
            });
            resolve(true);
        });
    },

    getPreviousConversations(context, payload: any) {
        return new Promise((resolve, reject) => {
            window.api
                .get(
                    `/conversations/client-previous-conversations?before_conversation=${
                        payload.before_conversation_id || ""
                    }`
                )
                .then((res: any) => {
                    context.commit("storePreviousConversations", {
                        data: res.data,
                        parent_conv_id: payload.before_conversation_id,
                    });

                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },
};

export default actions;
