import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';

const actions: ActionTree<ChatStateInterface, StateInterface> = {
    storeClientInitiateConvInfo(context, payload) {
        context.commit('storeClientInitiateConvInfo', payload);
    },

    // get conversations which joined by me
    getJoinedConversations(context, payload) {
        context.commit('storeJoinedConversation', payload);
    },

    // conversation state like (joined, left, close)
    storeConvState(context, payload) {
        context.commit('storeConvState', payload);
    },

    // get conversation messages from db
    getConvMessages(context, payload) {
        return new Promise((resolve, reject) => {
            const getConvJoinInfo = window.api.get(`conversations/${payload.convId}/sessions`),
                getConvMessages = window.api.get(`conversations/${payload.convId}/messages`);

            Promise.all([getConvJoinInfo, getConvMessages])
                .then((res) => {
                    const joinRes = res[0];
                    const messagesRes = res[1];

                    // remove client joining information
                    // set conversation state status (join/left)
                    // Note: need to manage conversation close status
                    const onlyAgentJoinInfo = joinRes.data.conversation_sessions
                        .filter((convSession: any) => convSession.socket_session.user)
                        .map((filteredConvSession: any) => {
                            return {
                                conv_state_status: filteredConvSession.left_at ? 'left' : 'joined',
                                ...filteredConvSession,
                            };
                        });

                    messagesRes.data = messagesRes.data.concat(onlyAgentJoinInfo);

                    context.commit('storeConvMessages', messagesRes);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // get client conversation messages from db
    getClientConvMessages(context, payload) {
        return new Promise((resolve, reject) => {
            const getConvJoinInfo = window.clientApi.get(`conversations/${payload.convId}/sessions`),
                getConvMessages = window.clientApi.get(`conversations/${payload.convId}/messages`);

            Promise.all([getConvJoinInfo, getConvMessages])
                .then((res) => {
                    const joinRes = res[0];
                    const messagesRes = res[1];

                    // remove client joining information
                    // set conversation state status (join/left)
                    // Note: need to manage conversation close status
                    const onlyAgentJoinInfo = joinRes.data.conversation_sessions
                        .filter((convSession: any) => convSession.socket_session.user)
                        .map((filteredConvSession: any) => {
                            return {
                                conv_state_status: filteredConvSession.left_at ? 'left' : 'joined',
                                ...filteredConvSession,
                            };
                        });

                    messagesRes.data = messagesRes.data.concat(onlyAgentJoinInfo);

                    context.commit('storeConvMessages', messagesRes);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    storeTemporaryMessage(context, payload) {
        return new Promise((resolve) => {
            context.commit('storeTemporaryMessage', payload);
            resolve(true);
        });
    },

    // get chat requests form db
    getChatRequests(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get('conversations/requests/list')
                .then((res: any) => {
                    context.commit('storeChatRequests', res);
                    resolve(res);
                })
                .catch((err: any) => {
                    window.clog(err, 'green');
                    reject(err);
                });
        });
    },

    storeTempChatRequest(context, payload) {
        return new Promise((resolve) => {
            context.commit('storeTempChatRequest', payload);
            resolve(true);
        });
    },

    // get chat requests form db
    getAgents(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get('users/active')
                .then((res: any) => {
                    context.commit('storeAgents', res);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // get online agents form db
    storeOnlineAgents(context, payload) {
        return new Promise((resolve) => {
            context.commit('storeOnlineAgents', payload);
            resolve(true);
        });
    },
};

export default actions;
