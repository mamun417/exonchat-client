import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';
import * as _l from 'lodash';

const actions: ActionTree<ChatStateInterface, StateInterface> = {
    storeClientInitiateConvInfo(context, payload) {
        context.commit('storeClientInitiateConvInfo', payload);

        const conv = payload.data.conv_data;

        context.commit('updateConversation', {
            conv_id: conv.id,
            conversation: _l.pick(conv, ['id', 'users_only', 'type', 'closed_at', 'created_by_id', 'closed_by_id']),
            sessions: conv.conversation_sessions,
            chat_department: conv.chat_department,
            ai_is_replying: conv.ai_is_replying,
        });
    },

    updateConvState(context, convSesInfo) {
        context.commit('updateConversation', {
            conv_id: convSesInfo.conversation_id,
            session: convSesInfo,
        });
    },
    updateConvStateToClosed(context, convInfo) {
        context.commit('updateConversation', {
            conv_id: convInfo.id,
            closed_by: convInfo.closed_by,
            // not destructuring convInfo. decision for later
            closed_at: convInfo.closed_at,
            closed_by_id: convInfo.closed_by_id,
        });
    },

    // get client conversation messages from db
    async getClientConvMessages(context, payload) {
        const getConvStateInfo = window.socketSessionApi.get(`conversations/${payload.convId}/sessions`),
            getConvMessages = window.socketSessionApi.get(`conversations/${payload.convId}/messages`);

        return await context.dispatch('storeConvMessages', { getConvStateInfo, getConvMessages });
    },

    // store conversation messages into state, so that getters can get the result
    getConvMessages(context, payload) {
        return new Promise((resolve, reject) => {
            const callerApi = payload.client_page ? window.socketSessionApi : window.api;

            callerApi
                .get(`conversations/${payload.convId}/messages?p=${payload.page || 1}&pp=50`)
                .then((res: any) => {
                    const conv = res.data;

                    conv.current_page = payload.page || 1; // now only for temp & test

                    context.commit('updateConversation', {
                        conv_id: conv.id,
                        conversation: _l.pick(conv, [
                            'id',
                            'users_only',
                            'type',
                            'closed_at',
                            'created_by_id',
                            'closed_by_id',
                            'current_page',
                        ]),
                        sessions: conv.conversation_sessions,
                        chat_department: conv.chat_department,
                        // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                        // if later we implement other way then review this
                        messages: conv.messages,
                        ai_is_replying: conv.ai_is_replying,
                        closed_by: conv.closed_by,
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
                .get('conversations/requests/list')
                .then((res: any) => {
                    const chatRequests = res.data;
                    console.log('chat requests', chatRequests);

                    chatRequests.forEach((request: any) => {
                        context.commit('updateConversation', {
                            conv_id: request.id,
                            conversation: _l.pick(request, [
                                'id',
                                'users_only',
                                'type',
                                'closed_at',
                                'created_by_id',
                                'closed_by_id',
                            ]),
                            sessions: request.conversation_sessions,
                            chat_department: request.chat_department,
                            // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                            // if later we implement other way then review this
                            message: request.messages[0],
                            ai_is_replying: request.ai_is_replying,
                            closed_by: request.closed_by,
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
                .get('conversations/joined')
                .then((res: any) => {
                    const convs = res.data || [];

                    console.log('other joined chats', convs);

                    convs.forEach((conv: any) => {
                        context.commit('updateConversation', {
                            conv_id: conv.id,
                            conversation: _l.pick(conv, [
                                'id',
                                'users_only',
                                'type',
                                'closed_at',
                                'created_by_id',
                                'closed_by_id',
                            ]),
                            sessions: conv.conversation_sessions,
                            chat_department: conv.chat_department,
                            // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                            // if later we implement other way then review this
                            message: conv.messages[0],
                            ai_is_replying: conv.ai_is_replying,
                            closed_by: conv.closed_by,
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
                .get('conversations/joined/me')
                .then((res: any) => {
                    const convs = res.data || [];
                    console.log('my joined chats', convs);

                    convs.forEach((request: any) => {
                        context.commit('updateConversation', {
                            conv_id: request.id,
                            conversation: _l.pick(request, [
                                'id',
                                'users_only',
                                'type',
                                'closed_at',
                                'created_by_id',
                                'closed_by_id',
                            ]),
                            sessions: request.conversation_sessions,
                            chat_department: request.chat_department,
                            // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                            // if later we implement other way then review this
                            message: request.messages[0],
                            ai_is_replying: request.ai_is_replying,
                            closed_by: request.closed_by,
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
            conversation: _l.pick(tempConv, ['id', 'users_only', 'type', 'closed_at', 'created_by_id', 'closed_by_id']),
            message: _l.omit(messageRes, ['conversation']),
            ai_is_replying: messageRes.ai_is_replying,
            sessions: tempConv.conversation_sessions,
            chat_department: tempConv.chat_department,
            closed_by: tempConv.closed_by,
            from: 'socket',
        };

        return new Promise((resolve) => {
            context.commit('updateConversation', obj);
            resolve(true);
        });
    },

    // get users
    getUsers(context) {
        return new Promise((resolve) => {
            const getMyConvWithUsers = window.socketSessionApi.get('conversations/user-to-user/me');
            const getUsers = window.api.get('users/active');

            Promise.all([getMyConvWithUsers, getUsers]).then(([myConvWithUsers, users]) => {
                // collect convSessions array
                const convSessions = myConvWithUsers.data
                    .map((conv: any) => {
                        return conv.conversation_sessions;
                    })
                    .flat();

                // set agent conversation_id
                const chatUsers = users.data.map((user: any) => {
                    const convSession = convSessions.find(
                        (convSession: any) => convSession.socket_session_id == user.socket_sessions[0].id
                    );

                    if (convSession) {
                        user.conversation_id = convSession.conversation_id;
                    }

                    return user;
                });

                context.commit('storeUsers', chatUsers);

                resolve(chatUsers);
            });
        });
    },

    // update online users
    updateOnlineUsers(context, onlineUsers) {
        return new Promise((resolve) => {
            context.commit('updateOnlineUsers', onlineUsers);
            resolve(true);
        });
    },

    clearClientChatInitiate(context) {
        context.commit('clearClientChatInitiate');
    },
};

export default actions;
