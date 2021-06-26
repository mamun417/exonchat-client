import moment from 'moment';
import _, * as _l from 'lodash';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';

const getters: GetterTree<ChatStateInterface, StateInterface> = {
    clientInitiateConvInfo(state) {
        return state.clientInitiateConvInfo;
    },

    clientsConversation: (state) => {
        return Object.values(state.conversations).filter((conv: any) => !conv.users_only);
    },

    teamConversation: (state) => {
        return Object.values(state.conversations).filter((conv: any) => conv.users_only);
    },

    conversations: (state) => {
        return state.conversations;
    },

    conversationInfo: (state) => (convId: any) => {
        if (state.conversations[convId]) {
            return _l.omit(state.conversations[convId], ['messages']);
        }

        return {};
    },

    conversationStatusForMe: (state) => (convId: any, mySesId: any) => {
        const conv = state.conversations[convId];

        if (!conv) return null;
        if (conv.closed_at) return 'closed';

        let convState = null;

        conv.sessions.forEach((ses: any) => {
            if (ses.socket_session_id === mySesId) {
                convState = ses.left_at ? 'left' : ses.joined_at ? 'joined' : null;
            }
        });

        return convState;
    },

    conversationWithUsersInfo: (state) => (convId: any, mySesId: any) => {
        let userSessions = [];

        if (state.conversations[convId]) {
            const conv = state.conversations[convId];

            userSessions = conv.sessions.filter((session: any) => {
                return (
                    (!conv.users_only && !session.socket_session.user) ||
                    (conv.users_only && session.socket_session_id !== mySesId)
                );
            });
        }

        return userSessions;
    },

    conversationConnectedUsers: (state) => (convId: any) => {
        let userSessions: any = {};

        if (state.conversations[convId]) {
            const conv = state.conversations[convId];

            // send connected users in this conversation without client. its for showing images
            userSessions = conv.sessions.filter((session: any) => {
                return (!conv.users_only && session.socket_session.user) || conv.users_only;
            });
        }

        return userSessions;
    },

    conversationMessages: (state) => (convId: any) => {
        return state.conversations[convId]?.messages || [];
    },

    typingState: (state) => (convId: any) => {
        const typingState: any = state.typingStates[convId];
        const conv = state.conversations[convId];

        if (!typingState || !conv) return [];

        const typingRes: any = [];

        Object.values(typingState).forEach((each: any) => {
            const sesInfo = _l.find(conv.sessions, ['socket_session_id', each.socket_session_id]);

            if (sesInfo) {
                typingRes.push({
                    ...each,
                    conv_ses_info: sesInfo,
                    socket_session: sesInfo.socket_session,
                });
            }
        });

        return typingRes;
    },

    getConvSesStateAsMsg: (state) => (convId: any) => {
        const stateAsMsg: any = [];

        if (!state.conversations[convId]) return [];

        const conv = state.conversations[convId];

        if (conv.closed_at) {
            stateAsMsg.push({
                id: `${conv.closed_by.id}_closed`,
                state: 'closed',
                session: conv.closed_by,
                conversation_id: convId,
                created_at: conv.closed_at,
                updated_at: conv.closed_at, // its for future
            });
        }

        if (conv.sessions && conv.sessions.length) {
            conv.sessions.forEach((convSes: any) => {
                ['joined', 'left'].forEach((state: any) => {
                    if (convSes[`${state}_at`]) {
                        stateAsMsg.push({
                            id: `${convSes.socket_session_id}_${state}`,
                            state: state,
                            session: convSes.socket_session,
                            conversation_id: convId,
                            created_at: convSes[`${state}_at`],
                            updated_at: convSes[`${state}_at`], // its for future
                        });
                    }
                });
            });
        }

        return stateAsMsg;
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
                const msg: any = _l
                    .sortBy(
                        Object.values(conv.messages).filter(
                            (msg: any) =>
                                msg.sender_type !== 'ai' && (msg.msg || (msg.attachments && msg.attachments.length))
                        ),
                        [(msg: any) => moment(msg.created_at).format('x')]
                    )
                    .reverse()[0];

                return { ...msg, conversation_session: conv.sessions[0] }; // conv.sessions[0] cz we are already filtering length 1
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
                const msg: any = _l
                    .sortBy(
                        Object.values(conv.messages).filter(
                            (msg: any) =>
                                msg.sender_type !== 'ai' && (msg.msg || (msg.attachments && msg.attachments.length))
                        ),
                        [(msg: any) => moment(msg.created_at).format('x')]
                    )
                    .reverse()[0];

                return { ...msg, conversation_session: conv.sessions[0] }; // conv.sessions[0] cz we are already filtering length 1
            });
    },

    myOngoingChats(state, getters, rootState, rootGetters) {
        return Object.values(state.conversations)
            .filter((conv: any) => {
                const sesInfo = _l.find(conv.sessions, [
                    'socket_session_id',
                    rootGetters['auth/profile']?.socket_session?.id,
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
                const msg: any = _l
                    .sortBy(
                        Object.values(conv.messages).filter(
                            (msg: any) =>
                                msg.sender_type !== 'ai' && (msg.msg || (msg.attachments && msg.attachments.length))
                        ),
                        [(msg: any) => moment(msg.created_at).format('x')]
                    )
                    .reverse()[0];

                return {
                    ...msg,
                    conversation_session: _.find(conv.sessions, function (o) {
                        return !o.socket_session.user;
                    }),
                };
            });
    },

    ongoingOtherChats(state, getters, rootState, rootGetters) {
        return Object.values(state.conversations)
            .filter((conv: any) => {
                const sesInfo = _l.find(conv.sessions, [
                    'socket_session_id',
                    rootGetters['auth/profile']?.socket_session?.id,
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
                const msg: any = _l
                    .sortBy(
                        Object.values(conv.messages).filter(
                            (msg: any) =>
                                msg.sender_type !== 'ai' && (msg.msg || (msg.attachments && msg.attachments.length))
                        ),
                        [(msg: any) => moment(msg.created_at).format('x')]
                    )
                    .reverse()[0];

                return {
                    ...msg,
                    conversation_session: _.find(conv.sessions, function (o) {
                        return !o.socket_session.user;
                    }),
                };
            });
    },

    departmentalChatRequestsCount(state) {
        const departments: any = {};

        Object.values(state.conversations).forEach((conv: any) => {
            if (
                !conv.users_only &&
                !conv.closed_at &&
                // conv.sessions.length === 1 && // if wants not joined then uncomment
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

    // convMessagesPaginationMeta(state) {
    //     return state.convMessagesPaginationMeta;
    // },
};

export default getters;
