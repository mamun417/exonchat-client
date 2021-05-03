import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { SpeechStateInterface } from './state';

const getters: GetterTree<SpeechStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },
};

export default getters;
