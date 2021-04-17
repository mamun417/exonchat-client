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
            state: convInfo.stateInfo || {},
        };
    },

    chatRequests(state) {
        return _l.sortBy(state.chatRequests, [(chatRequest) => moment(chatRequest.createdAt).format('x')]).reverse();
    },

    chatAgents(state, getters, rootState, rootGetters) {
        const allChatAgents = state.chatAgents;
        const authInfo = rootGetters['auth/profile'];

        return Object.values(allChatAgents).filter((agent: any) => authInfo.email !== agent.email);
    },

    onlineChatAgents(state) {
        return state.onlineChatAgents;
    },
};

export default getters;
