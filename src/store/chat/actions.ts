import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { ChatStateInterface } from "./state";

import * as _l from "lodash";
import helpers from "boot/helpers/helpers";

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

    storeNewChatFromClient(context, convInfo) {
        const convData = convInfo.conv_data;

        context.commit("updateConversation", {
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
            caller: "storeNewChatFromClient",
        });
    },

    updateConvState(context, convSesInfo) {
        context.commit("updateConversation", {
            conv_id: convSesInfo.conversation_id,
            session: convSesInfo,
            caller: "updateConvState",
        });
    },
    updateConvStateToClosed(context, convInfo) {
        context.commit("updateConversation", {
            conv_id: convInfo.id,
            closed_by: convInfo.closed_by,
            // not destructuring convInfo. decision for later
            closed_at: convInfo.closed_at,
            closed_by_id: convInfo.closed_by_id,
            sessions: convInfo.conversation_sessions, // not sending now
            caller: "updateConvStateToClosed",
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

            if (conversationInfo && conversationInfo.pagination_meta) {
                current_page = conversationInfo.pagination_meta.current_page;
            }

            callerApi
                .get(`conversations/${payload.convId}/messages`, {
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
                        rating: conv.conversation_rating,
                        pagination_meta: pagination,
                        caller: "getConvMessages",
                    });

                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // get chat requests form db
    getChatRequests(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get("conversations/requests/list")
                .then((res: any) => {
                    const chatRequests = res.data;
                    // console.log('chat requests', chatRequests);

                    chatRequests.forEach((request: any) => {
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
                    });
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },
    // getOtherJoinedChats form db
    getOtherJoinedChats(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get("conversations/joined")
                .then((res: any) => {
                    const convs = res.data || [];

                    // console.log('other joined chats', convs);

                    convs.forEach((conv: any) => {
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
                    });

                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },
    // getJoinedChatsWithMe form db
    getJoinedChatsWithMe(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get("conversations/joined/me")
                .then((res: any) => {
                    const convs = res.data || [];
                    // console.log('my joined chats', convs);

                    convs.forEach((request: any) => {
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
                    });
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // store message which came from socket events
    storeMessage(context, messageRes) {
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

        return new Promise((resolve) => {
            context.commit("updateConversation", obj);

            if (messageRes.hasOwnProperty("socket_event") && messageRes.socket_event === "ec_msg_from_user") {
                if (messageRes.hasOwnProperty("caller_page") && messageRes.caller_page === "web-chat") {
                    helpers.notifications().replyOne.play();
                }
            }

            if (messageRes.hasOwnProperty("socket_event") && messageRes.socket_event === "ec_msg_from_client") {
                helpers.notifications().replyTwo.play();
            }

            resolve(true);
        });
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
    updateOnlineUsers(context, onlineUsers) {
        return new Promise((resolve) => {
            context.commit("updateOnlineUsers", onlineUsers);
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
};

export default actions;
