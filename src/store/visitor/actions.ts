import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { VisitorsStateInterface } from './state';

const actions: ActionTree<VisitorsStateInterface, StateInterface> = {
    updateVisitor(context, visitorInfo) {
        return new Promise((resolve) => {
            context.commit('updateVisitor', visitorInfo);

            resolve(true);
        });
    },
};

export default actions;
