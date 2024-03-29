import { Module } from "vuex";
import { StateInterface } from "../index";
import state, { SocketStateInterface } from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const socketModule: Module<SocketStateInterface, StateInterface> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
};

export default socketModule;
