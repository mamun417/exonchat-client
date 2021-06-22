import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ClientConversationStateInterface } from './state';
import * as _l from 'lodash';
import moment from 'moment';

const getters: GetterTree<ClientConversationStateInterface, StateInterface> = {
    paginationMeta(state) {
        return state.paginationMeta;
    },

    pipeline(state) {
        return state.pipeline;
    },

    newIds(state) {
        return state.newIds;
    },

    getClientConversations(state) {
        return _l
            .sortBy(state.clientConversations, [
                (clientConversation) => moment(clientConversation.created_at).format('x'),
            ])
            .reverse();
    },
};

export default getters;
