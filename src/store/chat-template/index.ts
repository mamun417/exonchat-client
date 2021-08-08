import { Module } from "vuex";
import { StateInterface } from "../index";
import state, { ChatTemplateStateInterface } from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const speechModule: Module<ChatTemplateStateInterface, StateInterface> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
};

export default speechModule;
