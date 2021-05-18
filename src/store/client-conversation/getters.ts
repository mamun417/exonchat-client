import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ClientConversationStateInterface } from './state';

const getters: GetterTree<ClientConversationStateInterface, StateInterface> = {
    getClientConversations(state) {
        return state.clientConversations;
    },
};

export default getters;
