import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ClientConversationStateInterface } from './state';

const actions: ActionTree<ClientConversationStateInterface, StateInterface> = {
    getClientConversations() {
        return new Promise((resolve, reject) => {
            window.api
                .get('conversations/clients-conversation')
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },
};

export default actions;
