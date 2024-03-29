import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { ClientConversationStateInterface } from "./state";
import * as _l from "lodash";
import moment from "moment";

const getters: GetterTree<ClientConversationStateInterface, StateInterface> = {
    paginationMeta(state) {
        return state.paginationMeta;
    },

    pipeline(state) {
        return state.pipeline;
    },

    newLoadedConversationIds(state) {
        return state.newLoadedConversationIds;
    },
};

export default getters;
