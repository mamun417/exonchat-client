import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';

const actions: ActionTree<ChatStateInterface, StateInterface> = {
    storeConvInfo(context, payload) {
        context.commit('storeConvInfo', payload);
    },

    setConvState(context, payload) {
        context.commit('setConvState', payload);
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
                .get('conversations/t/m')
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
};

export default actions;
