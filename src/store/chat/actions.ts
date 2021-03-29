import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';

const actions: ActionTree<ChatStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },

    setConvState(context, payload) {
        context.commit('setConvState', payload);
    },

    getConvMessages(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .get(`conversations/${payload.convId}/messages`)
                .then((res: any) => {
                    context.commit('storeConvMessages', res.data);
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

    storeChatRequest(context, payload) {
        return new Promise((resolve) => {
            context.commit('storeChatRequest', payload);
            resolve(true);
        });
    },
};
export default actions;
