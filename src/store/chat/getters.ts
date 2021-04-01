import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';

const getters: GetterTree<ChatStateInterface, StateInterface> = {
    someAction(/* state */) {
        // your code
    },
    auth(/* state */) {
        // your code
    },

    convStateInfo(state) {
        return state.convStateInfo;
    },

    // convInfo(context) {
    //     return context.convInfo;
    // },

    messages: (state) => (convId: any) => {
        const messages = state.messages;

        if (!convId) {
            return messages;
        }

        return messages[convId]?.messages;
    },

    chatRequest(state) {
        return state.chatRequest;
    },
};

export default getters;
