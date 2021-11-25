import { MutationTree } from "vuex";
import { ChatHistoryStateInterface } from "./state";
import helpers from "../../boot/helpers/helpers";

const mutation: MutationTree<ChatHistoryStateInterface> = {
    storeChatHistories(state: ChatHistoryStateInterface, chatHistories: any) {
        state.chatHistories = chatHistories;
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
};

export default mutation;
