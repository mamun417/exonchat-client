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
            window.api
                .get(`conversations/${payload.convId}/messages`)
                .then((res: any) => {
                    context.commit('storeConvMessages', res);
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
            window.clientApi
                .get(`conversations/${payload.convId}/messages`)
                .then((res: any) => {
                    context.commit('storeConvMessages', res);
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

    storeTempOnlineAgents(context, payload) {
        return new Promise((resolve) => {
            context.commit('storeTempOnlineAgents', payload);
            resolve(true);
        });
    },
};

export default actions;
