import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';

const actions: ActionTree<ChatStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },

    storeChatInitiate(context, payload) {
        context.commit('storeChatInitiate', payload);
    },

    storeTemporaryMessage(context, payload) {
        context.commit('storeTemporaryMessage', payload);
    }
};

export default actions;
