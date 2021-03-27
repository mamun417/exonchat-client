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

    convStateInfo(context) {
        return context.convStateInfo;
    },

    // convInfo(context) {
    //     return context.convInfo;
    // },

    messages(context) {
        return context.messages;
    },
};

export default getters;
