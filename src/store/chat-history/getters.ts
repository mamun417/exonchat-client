import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { ChatHistoryStateInterface } from "./state";

const getters: GetterTree<ChatHistoryStateInterface, StateInterface> = {
    paginationMeta(state) {
        return state.paginationMeta;
    },

    pipeline(state) {
        return state.pipeline;
    },

    newLoadedChatHistoriesIds(state) {
        return state.newLoadedChatHistoriesIds;
    },
};

export default getters;
