import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ClientConversationStateInterface } from './state';

const getters: GetterTree<ClientConversationStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },
};

export default getters;
