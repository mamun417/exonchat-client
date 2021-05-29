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

    incomingChatRequests(state, getters, rootState, rootGetters) {
        return Object.values(state.conversations)
            .filter((conv: any) => {
                // Object.keys(conv.messages).length check for safe
                return (
                    !conv.users_only &&
                    !conv.closed_at &&
                    !_l.find(rootGetters['auth/profile'].chat_departments, ['tag', conv.chat_department.tag]) &&
                    conv.sessions.length === 1 &&
                    Object.keys(conv.messages).length
                );
            })
            .map((conv: any) => {
                return _l.sortBy(Object.values(conv.messages), [(msg: any) => moment(msg.created_at).format('x')])[0];
            });
    },
    incomingChatRequestsForMe(state, getters, rootState, rootGetters) {
        return Object.values(state.conversations)
            .filter((conv: any) => {
                // Object.keys(conv.messages).length check for safe
                return (
                    !conv.users_only &&
                    !conv.closed_at &&
                    _l.find(rootGetters['auth/profile'].chat_departments, ['tag', conv.chat_department.tag]) &&
                    conv.sessions.length === 1 &&
                    Object.keys(conv.messages).length
                );
            })
            .map((conv: any) => {
                return _l.sortBy(Object.values(conv.messages), [(msg: any) => moment(msg.created_at).format('x')])[0];
            });
    },

    myOngoingChats(state, getters, rootState, rootGetters) {
        return Object.values(state.conversations)
            .filter((conv: any) => {
                const sesInfo = _l.find(conv.sessions, [
                    'socket_session_id',
                    rootGetters['auth/profile'].socket_session.id,
                ]);

                // Object.keys(conv.messages).length check for safe
                return (
                    !conv.users_only &&
                    !conv.closed_at &&
                    conv.sessions.length > 1 &&
                    sesInfo &&
                    !sesInfo.left_at &&
                    Object.keys(conv.messages).length
                );
            })
            .map((conv: any) => {
                return _l.sortBy(Object.values(conv.messages), [(msg: any) => moment(msg.created_at).format('x')])[0];
            });
    },

    ongoingOtherChats(state, getters, rootState, rootGetters) {
        return Object.values(state.conversations)
            .filter((conv: any) => {
                const sesInfo = _l.find(conv.sessions, [
                    'socket_session_id',
                    rootGetters['auth/profile'].socket_session.id,
                ]);

                // Object.keys(conv.messages).length check for safe
                return (
                    !conv.users_only &&
                    !conv.closed_at &&
                    conv.sessions.length > 1 &&
                    !sesInfo &&
                    Object.keys(conv.messages).length
                );
            })
            .map((conv: any) => {
                return _l.sortBy(Object.values(conv.messages), [(msg: any) => moment(msg.created_at).format('x')])[0];
            });
    },

    departmentalChatRequestsCount(state) {
        const departments: any = {};

        Object.values(state.conversations).forEach((conv: any) => {
            if (
                !conv.users_only &&
                !conv.closed_at &&
                conv.sessions.length === 1 &&
                // Object.keys(conv.messages).length check for safe
                Object.keys(conv.messages).length
            ) {
                if (!departments.hasOwnProperty(conv.chat_department.tag)) {
                    departments[conv.chat_department.tag] = {};

                    departments[conv.chat_department.tag].id = conv.chat_department.id;
                    departments[conv.chat_department.tag].name = conv.chat_department.tag;
                    departments[conv.chat_department.tag].count = 0;
                }

                departments[conv.chat_department.tag].count += 1;
            }
        });

        return departments;
    },

    chatUsers(state, getters, rootState, rootGetters) {
        const allUsers = state.chatUsers;

        const authInfo = rootGetters['auth/profile'];

        return Object.values(allUsers).filter((user: any) => authInfo.email !== user.email);
    },
};

export default getters;
