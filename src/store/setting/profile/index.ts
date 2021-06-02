import { Module } from 'vuex';
import { StateInterface } from 'src/store';
import state, { SettingProfileInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const settingProfileModule: Module<SettingProfileInterface, StateInterface> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
};

export default settingProfileModule;
