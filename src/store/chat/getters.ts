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

    convInfo(context) {
        return context.convInfo;
    },

    messages(context) {
        return context.messages;
    },
};

export default getters;
