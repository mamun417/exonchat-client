import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';

const getters: GetterTree<ChatStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },
    auth(/* context */) {
        // your code
    },

    joinConvInfo(context) {
        return context.joinConvInfo;
    },

    convInfo(context) {
        return context.convInfo;
    },

    messages(context) {
        return context.messages;
    },
};

export default getters;
