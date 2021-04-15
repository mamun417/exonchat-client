import moment from 'moment';
import * as _l from 'lodash';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';

const getters: GetterTree<ChatStateInterface, StateInterface> = {
    clientInitiateConvInfo(state) {
        return state.clientInitiateConvInfo;
    },

    convStateInfo: (state) => (convId: any) => {
        return state.convStateInfo[convId];
    },

    messages: (state) => (convId: any) => {
        const allMessages = state.messages;

        if (!convId) return allMessages;

        const convMessages = allMessages[convId]?.messages;

        return _l.sortBy(convMessages, [(message) => moment(message.created_at).format('x')]);
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
