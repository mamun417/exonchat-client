import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { IntentStateInterface } from './state';

const getters: GetterTree<IntentStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },
};

export default getters;
