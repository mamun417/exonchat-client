import { MutationTree } from 'vuex';
import { ChatStateInterface } from './state';

const mutation: MutationTree<ChatStateInterface> = {
    someMutation(/* state: ChatStateInterface */) {
        // your code
    },

    storeChatInitiate() {
        console.log('okkk');
        localStorage.setItem('chatInitiate', 'true');
    },

    storeTemMessage(state: ChatStateInterface, payload: any) {
        state.messages.push(payload);
    }
};

export default mutation;
