import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { VisitorsStateInterface } from './state';

const getters: GetterTree<VisitorsStateInterface, StateInterface> = {
    visitors(state) {
        return Object.values(state.visitors);
    },
};

export default getters;
