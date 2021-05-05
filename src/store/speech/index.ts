import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { SpeechStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const speechModule: Module<SpeechStateInterface, StateInterface> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
};

export default speechModule;
