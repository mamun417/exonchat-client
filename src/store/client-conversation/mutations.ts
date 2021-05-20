import { MutationTree } from 'vuex';
import { ClientConversationStateInterface } from './state';

const mutation: MutationTree<ClientConversationStateInterface> = {
    storeClientConversations(state: ClientConversationStateInterface, clientConversations: any) {
        clientConversations.forEach((clientConv: any) => {
            const convId = clientConv.id;
            state.clientConversations[convId] = clientConv;
        });
    },

    updateClientConversations(state: ClientConversationStateInterface, clientConversation: any) {
        const convId = clientConversation.id;
        state.clientConversations[convId] = clientConversation;
    },
};

export default mutation;
