import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';

const actions: ActionTree<ChatStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },

    storeChatInitiate(context) {
        context.commit('storeChatInitiate');
    },

    storeTemMessage(context, payload) {
        context.commit('storeTemMessage', payload);
    }
};

export default actions;
