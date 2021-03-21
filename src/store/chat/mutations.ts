import { MutationTree } from 'vuex';
import { ChatStateInterface } from './state';
import { date } from 'quasar';

const mutation: MutationTree<ChatStateInterface> = {
    someMutation(/* state: ChatStateInterface */) {
        // your code
    },

    storeJoinConversation(state: ChatStateInterface, payload: any) {
        payload.data = {
            convState: 'joined'
        };

        const data = JSON.stringify(payload.data);
        localStorage.setItem('joinConvInfo', data);
        state.joinConvInfo = payload.data;
    },

    storeChatInitiate(state: ChatStateInterface, payload: any) {
        const data = JSON.stringify(payload.data);
        localStorage.setItem('convInfo', data);
        state.convInfo = payload.data;
    },

    storeTemporaryMessage(state: ChatStateInterface, payload: any) {
        state.messages.push(payload);
    },
};

export default mutation;
