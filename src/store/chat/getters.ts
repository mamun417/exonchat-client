import moment from 'moment';
import helpers from 'boot/helpers/helpers';
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

        if (!convId) {
            return allMessages;
        }

        const convMessages = allMessages[convId]?.messages;

        return _l.sortBy(convMessages, [
            function (message) {
                return moment(message.created_at).format('x');
            },
        ]);
    },

    chatRequests(state) {
        return _l
            .sortBy(state.chatRequests, [
                function (chatRequest) {
                    return moment(chatRequest.createdAt).format('x');
                },
            ])
            .reverse();
    },

    chatAgents(state) {
        const allChatAgents = state.chatAgents;
        const mySocketSessionId = helpers.getMySocketSessionId();

        return _l.filter(allChatAgents, (agent: any) => {
            if (!agent.socket_sessions.length) return false;

            let socketSessions = _l.mapValues(agent.socket_sessions, 'id');

            socketSessions = Object.values(socketSessions);

            return !socketSessions.includes(mySocketSessionId);
        });
    },

    onlineChatAgents(state) {
        return state.onlineChatAgents;
    },
};

export default getters;
