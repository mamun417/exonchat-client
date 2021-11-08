import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { OfflineChatReqStateInterface } from "./state";

const getters: GetterTree<OfflineChatReqStateInterface, StateInterface> = {
    paginationMeta(state) {
        return state.paginationMeta;
    },

    pipeline(state) {
        return state.pipeline;
    },

    getNotSolvedOfflineChatReqCount(state) {
        return state.notSolvedOfflineChatReqCount;
    },
};

export default getters;
