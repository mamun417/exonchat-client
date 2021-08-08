import { Module } from "vuex";
import { StateInterface } from "../index";
import state, { ClientConversationStateInterface } from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const speechModule: Module<ClientConversationStateInterface, StateInterface> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
};

export default speechModule;
