import { MutationTree } from 'vuex';
import { ClientConversationStateInterface } from './state';

const mutation: MutationTree<ClientConversationStateInterface> = {
    storeClientConversations(state: ClientConversationStateInterface, clientConversations: any) {
        state.clientConversations = clientConversations;
    },
};

export default mutation;
