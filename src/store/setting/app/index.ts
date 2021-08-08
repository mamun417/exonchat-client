import { Module } from "vuex";
import { StateInterface } from "src/store";
import state, { SettingAppInterface } from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const uiModule: Module<SettingAppInterface, StateInterface> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
};

export default uiModule;
