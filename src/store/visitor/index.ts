import { Module } from "vuex";
import { StateInterface } from "../index";
import state, { VisitorsStateInterface } from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const visitorsModule: Module<VisitorsStateInterface, StateInterface> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
};

export default visitorsModule;
