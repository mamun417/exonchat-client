import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { OfflineChatReqStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const speechModule: Module<OfflineChatReqStateInterface, StateInterface> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
};

export default speechModule;
