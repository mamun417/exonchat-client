import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { ClientConversationStateInterface } from "./state";
import * as _l from "lodash";

const actions: ActionTree<ClientConversationStateInterface, StateInterface> = {
    updateCurrentPage(context, currentPage) {
        return new Promise((resolve) => {
            context.commit("updateCurrentPage", currentPage);
            resolve(true);
        });
    },

    updatePipeline(context, payload) {
        return new Promise((resolve) => {
            context.commit("updatePipeline", payload);
            context.commit("updateCurrentPage", 1);
            resolve(true);
        });
    },
};

export default actions;
