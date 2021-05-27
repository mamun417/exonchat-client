import moment from 'moment';
import * as _l from 'lodash';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';

const getters: GetterTree<ChatStateInterface, StateInterface> = {
    clientInitiateConvInfo(state) {
        return state.clientInitiateConvInfo;
    },

    conversationInfo: (state) => (convId: any) => {
        const allConvInfo = state.conversationInfo;
        const convInfo = allConvInfo[convId] || {};

        const messages = _l.sortBy(convInfo.messages, [(message) => moment(message.created_at).format('x')]);

        return {
            messages,
            stateInfo: convInfo.stateInfo || {},
        };
    },

    chatRequests(state) {
        return _l.sortBy(state.chatRequests, [(chatRequest) => moment(chatRequest.created_at).format('x')]).reverse();
    },

    chatUsers(state, getters, rootState, rootGetters) {
        const allUsers = state.chatUsers;

        const authInfo = rootGetters['auth/profile'];

        return Object.values(allUsers).filter((user: any) => authInfo.email !== user.email);
    },
};

export default getters;
