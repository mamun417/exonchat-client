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
            ai_is_replying: conv.ai_is_replying,
            caller: "storeClientInitiateConvInfo",
        });
    },

    async storeNewChatFromClient(context, convInfo) {
        const convData = convInfo.conv_data;

        const obj = {
            conv_id: convData.id,
            notify_status: convInfo.notify, // of this action if notify then true
            caller: "storeNewChatFromClient",
        };
        context.commit("updateConversation", obj);

        await Conversation.insert({ data: convData });

        if (convData.log_message) {
            await Message.insert({ data: convData.log_message });
        }

        if (
            localStorage.getItem("ec_not_in_tabs") &&
            window.$browser_tab_id === localStorage.getItem("ec_last_visited_tab")
        ) {
            const clientInfo = _l.find(convData.conversation_sessions, (convSes: any) => !convSes.socket_session.user);

            const notification = new Notification(`New chat from ${clientInfo?.socket_session.init_name}`, {
                body: `Department : ${convData.chat_department.display_name}`,
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

    async updateConvSesInfo(context, data) {
        const profile = context.rootGetters["auth/profile"];

        await ConversationSession.insert({ data: data.conv_ses_obj });

        if (data.action === "chat_transfer_sent" && profile.online_status === "online") {
            if (window.$browser_tab_id === localStorage.getItem("ec_current_visiting_tab")) {
                helpers.notifications().reqOne.play().then();
            }

            if (
                localStorage.getItem("ec_not_in_tabs") &&
                window.$browser_tab_id === localStorage.getItem("ec_last_visited_tab")
            ) {
                const notification = new Notification(
                    `Chat transfer request from ${data.original_payload?.agent_info?.user_meta?.display_name}`
                    // {
                    //     body: `Department : ${convObj.chat_department.display_name}`, // need to call running api at first
                    // }
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
            caller: "updateConvState",
        });

        await ConversationSession.insert({ data: convSesInfo });

        if (convSesInfo.log_message) {
            await Message.insert({ data: convSesInfo.log_message });
        }
    },
    async updateConvStateToClosed(context, convInfo) {
        context.commit("updateConversation", {
            conv_id: convInfo.id,
            caller: "updateConvStateToClosed",
        });

        await Conversation.insert({ data: convInfo });

        if (convInfo.log_message) {
            await Message.insert({ data: convInfo.log_message });
        }
    },
    async updateConversationSession(context, conversationSession) {
        await ConversationSession.update({
            where: conversationSession.id,
            data: conversationSession,
        });
    },

    // store conversation messages into state, so that getters can get the result
    async getConvMessages(context, payload) {
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
        if (callConvInfo && callConvInfo.pagination_meta && callConvInfo.pagination_meta.current_page) {
            current_page = callConvInfo.pagination_meta.current_page;
        }

        // nn
        // const conversation: any = Conversation.query().where("id", payload.convId).with("messages").first();
        // console.log({ conversation });
        // if (!conversation?.messages?.length) {
        //     current_page = 0;
        // }

        // call next conv_id so that we can get prev data
        const res = await callerApi.get(`conversations/${callConvId}/messages`, {
            params: {
                p: current_page + 1,
                pp: 25,
            },
        });
        const conv = res.data.conversation.data;
        const pagination = res.data.conversation.pagination;

        if (!conv.messages.length) {
            pagination.current_page = current_page; // reset to the previous pagination so that +1 turns valid
        }

        // conv.current_page = payload.page || 1; // now only for temp & test

        context.commit("updateConversation", {
            conv_id: conv.id,
            ai_is_replying: conv.ai_is_replying,
            pagination_meta: pagination,
            caller: "getConvMessages",
        });

        await Conversation.insert({ data: conv });

        return res;
    },

    // get chat requests form db
    async getChatRequests(context) {
        try {
            const chatRequestRes = await window.api.get("conversations/requests/list");

            const chatRequests = chatRequestRes.data;
            // console.log('chat requests', chatRequests);

            for (const request of chatRequests) {
                await Conversation.insert({ data: request });

                context.commit("updateConversation", {
                    conv_id: request.id,
                    ai_is_replying: request.ai_is_replying,
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

                context.commit("updateConversation", {
                    conv_id: conv.id,
                    ai_is_replying: conv.ai_is_replying,
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
                await Conversation.insert({ data: request });

                context.commit("updateConversation", {
                    conv_id: request.id,
                    ai_is_replying: request.ai_is_replying,
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
            ai_is_replying: messageRes.ai_is_replying,
            from: "socket",
            caller: "storeMessage",
        };

        context.commit("updateConversation", obj);

        if (messageRes.temp_id) {
            await Message.delete(messageRes.temp_id);
        }

        await Message.insert({ data: messageRes });
        window.emitter.emit("message_inserted_or_updated", { conv_id: tempConv.id });

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
                    const clientInfo = _l.find(
                        tempConv.conversation_sessions,
                        (convSes: any) => !convSes.socket_session.user
                    );

                    const notification = new Notification(`New message from ${clientInfo?.socket_session.init_name}`, {
                        body: messageRes.msg,
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
    async getUsers(context) {
        const myConvWithUsers = await window.socketSessionApi.get("conversations/user-to-user/me");
        const users = await window.api.get("users/active");

        await Conversation.insert({ data: myConvWithUsers.data });

        // collect convSessions array
        myConvWithUsers.data.forEach((conv: any) => {
            context.commit("updateConversation", {
                conv_id: conv.id,
                ai_is_replying: conv.ai_is_replying,
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

        context.commit("storeUsers", chatUsers);
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

    async updateConvRating(context, convRatingInfo) {
        context.commit("updateConversation", {
            conv_id: convRatingInfo.conversation_id,
            rating: convRatingInfo,
            caller: "updateConvRating",
        });

        await Conversation.update({
            where: convRatingInfo.conversation_id,
            data: {
                conversation_rating: convRatingInfo,
            },
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
