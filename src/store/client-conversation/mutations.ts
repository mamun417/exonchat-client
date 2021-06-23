import { MutationTree } from 'vuex';
import { ClientConversationStateInterface } from './state';
import helpers from '../../boot/helpers/helpers';

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

    updatePaginationMeta(state, data: any) {
        state.paginationMeta = data;
    },

    updateCurrentPage(state, currentPage) {
        state.paginationMeta.current_page = currentPage;
    },

    updatePipeline(state, payload) {
        state.pipeline = helpers.updatePipeline(state.pipeline, payload.pipeline);
    },

    updateNewLoadedConversationIds(state, newIds) {
        state.newLoadedConversationIds = [];
        state.newLoadedConversationIds = newIds;
    },

    // updatePipeline(state, payload) {
    //     return new Promise((resolve) => {
    //         state.pipeline = payload.vm.$updatePipeline(state.pipeline, payload.pipeline);
    //         resolve(true);
    //     });
    // },
};

export default mutation;
