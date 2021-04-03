// import { _l } from 'src/boot/helpers';
import moment from 'moment';
import { _l } from 'src/boot/helpers';
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

    convInfo(state) {
        return state.convInfo;
    },

    convStateInfo(state) {
        return state.convStateInfo;
    },

    messages: (state) => (convId: any) => {
        const allMessages = state.messages;

        if (!convId) {
            return allMessages;
        }

        const convMessages = allMessages[convId]?.messages;
        
        return _l.sortBy(convMessages, [
            function (message) {
                return moment(message.created_at).format('x');
            },
        ]);
    },

    chatRequest(state) {
        return state.chatRequest;
    },
};

export default getters;
