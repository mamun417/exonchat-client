import { MutationTree } from 'vuex';
import { ChatHistoryStateInterface } from './state';
import helpers from '../../boot/helpers/helpers';

const mutation: MutationTree<ChatHistoryStateInterface> = {
    updatePaginationMeta(state, data: any) {
        state.paginationMeta = data;
    },

    updateCurrentPage(state, currentPage) {
        state.paginationMeta.current_page = currentPage;
    },

    updatePipeline(state, payload) {
        state.pipeline = helpers.updatePipeline(state.pipeline, payload.pipeline);
    },

    updateNewLoadedChatHistoriesIds(state, newIds) {
        state.newLoadedChatHistoriesIds = [];
        state.newLoadedChatHistoriesIds = newIds;
    },
};

export default mutation;
