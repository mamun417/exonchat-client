import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ClientConversationStateInterface } from './state';

const actions: ActionTree<ClientConversationStateInterface, StateInterface> = {
    getClientConversations(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get('conversations/clients-conversation')
                .then((res: any) => {
                    context.commit('storeClientConversations', res.data);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // get client_conversation by conversation_id then update client_conversation list
    updateClientConversations(context, convId: any) {
        return new Promise((resolve, reject) => {
            window.api
                .get(`conversations/client-conversation/${convId}`)
                .then((res: any) => {
                    context.commit('updateClientConversations', res.data);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },
};

export default actions;
