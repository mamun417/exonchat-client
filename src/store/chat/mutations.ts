import { MutationTree } from 'vuex';
import { ChatStateInterface } from './state';

const mutation: MutationTree<ChatStateInterface> = {
    someMutation(/* state: ChatStateInterface */) {
        // your code
    },

    setConvState(state: ChatStateInterface, payload: any) {
        const data = JSON.stringify(payload.data);
        localStorage.setItem('convStateInfo', data);
        state.convStateInfo = payload.data;
    },

    storeTemporaryMessage(state: ChatStateInterface, payload: any) {
        state.messages.push(payload);
    },
};

export default mutation;
