import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatTemplateStateInterface } from './state';

const getters: GetterTree<ChatTemplateStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },
};

export default getters;
