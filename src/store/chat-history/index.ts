import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { ChatHistoryStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const speechModule: Module<ChatHistoryStateInterface, StateInterface> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
};

export default speechModule;
