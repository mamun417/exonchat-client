import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { ChatStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const chatModule: Module<ChatStateInterface, StateInterface> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
};

export default chatModule;
