import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';
import helpers from 'boot/helpers/helpers';
import * as _ from 'lodash';

const actions: ActionTree<ChatStateInterface, StateInterface> = {
    storeClientInitiateConvInfo(context, payload) {
        context.commit('storeClientInitiateConvInfo', payload);
    },

    // conversation state (joined, left, close) like message
    async storeConvState(context, convInfo) {
        convInfo.messages = getConStateInfoAsMessageArray(convInfo);
        convInfo.convStateInfo = {
            status: convInfo.state_status,
        };

        context.commit('storeConvMessages', convInfo);

        if (window.router.currentRoute._value.name !== 'web-chat.index') {
            await context.dispatch('client_conversation/updateClientConversations', convInfo.conversation_id, {
                root: true,
            });
        }
    },

    // get conversation messages from db
    async getAgentConvMessages(context, payload) {
        const getConvStateInfo = window.api.get(`conversations/${payload.convId}/sessions`),
            getConvMessages = window.api.get(`conversations/${payload.convId}/messages`);

        return await context.dispatch('storeConvMessages', { getConvStateInfo, getConvMessages });
    },

    // get client conversation messages from db
    async getClientConvMessages(context, payload) {
        const getConvStateInfo = window.socketSessionApi.get(`conversations/${payload.convId}/sessions`),
            getConvMessages = window.socketSessionApi.get(`conversations/${payload.convId}/messages`);

        return await context.dispatch('storeConvMessages', { getConvStateInfo, getConvMessages });
    },

    // store conversation messages into state, so that getters can get the result
    storeConvMessages(context, { getConvStateInfo, getConvMessages }) {
        return new Promise((resolve, reject) => {
            Promise.all([getConvStateInfo, getConvMessages])
                .then(([convStateRes, messagesRes]) => {
                    // messagesRes contain messages []
                    const conversationInfo = _.cloneDeep(messagesRes);

                    // remove client joining information
                    const agentState = convStateRes.data.conversation_sessions.filter(
                        (convSession: any) => convSession.socket_session.user
                    );

                    let onlyAgentConvStateRes = agentState
                        .map((filteredConvSession: any) => {
                            return getConStateInfoAsMessageArray(filteredConvSession);
                        })
                        .flat();

                    // define convStateInfo empty obj to avoid unexpected error
                    conversationInfo.convStateInfo = {};

                    // some time state will be null, cause when client send message but no agent join the conversation
                    // then client reload the page no need this functionality to create state information
                    if (agentState.length) {
                        if (convStateRes.data.closed_at) {
                            onlyAgentConvStateRes = onlyAgentConvStateRes.concat(
                                getClosedInfoAsMessageArray(convStateRes)
                            );

                            conversationInfo.convStateInfo = { status: 'closed' };
                        } else {
                            // getConvJoinAndLeftStateStatus return object like { status: join/left }
                            conversationInfo.convStateInfo = getConvJoinAndLeftStateStatus(convStateRes);
                        }
                    }

                    conversationInfo.convStateInfo.users_only = convStateRes.data?.users_only;
                    conversationInfo.messages = conversationInfo.data.concat(onlyAgentConvStateRes);

                    context.commit('storeConvMessages', conversationInfo);

                    resolve(messagesRes);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // using for both user and client
    async storeTemporaryMessage(context, payload) {
        return new Promise((resolve) => {
            const data = {
                messages: [payload],
            };

            context.commit('storeConvMessages', data);

            if (window.router.currentRoute._value.name !== 'web-chat.index') {
                context.dispatch('client_conversation/updateClientConversations', data.messages[0].conversation_id, {
                    root: true,
                });
            }

            resolve(true);
        });
    },

    // get chat requests form db
    getChatRequests(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get('conversations/requests/list')
                .then((res: any) => {
                    const chatRequests = res.data;

                    context.commit('storeChatRequests', res.data);

                    console.log(chatRequests);

                    chatRequests.forEach((request: any) => {
                        context.commit('updateConversation', {
                            conv_id: request.id,
                            sessions: request.conversation_sessions,
                            chat_department: request.chat_department,
                            message: request.messages, // returns only one so no array. now for sure that at least 1 msg will be available
                            ai_is_replying: request.ai_is_replying,
                        });
                    });
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    storeTempChatRequest(context, payload) {
        return new Promise((resolve) => {
            // make same pattern as like as get chat request from db
            const data = {
                ...payload,
                messages: [
                    {
                        ...payload,
                    },
                ],
            };

            context.commit('storeChatRequests', [data]);
            resolve(true);
        });
    },

    // get users
    getUsers(context) {
        return new Promise((resolve) => {
            const getMyConvWithUsers = window.socketSessionApi.get('conversations/user-to-user/me');
            const getUsers = window.api.get('users/active');

            Promise.all([getMyConvWithUsers, getUsers]).then(([myConvWithUsers, users]) => {
                // collect convSessions array
                const convSessions = myConvWithUsers.data
                    .map((conv: any) => {
                        return conv.conversation_sessions;
                    })
                    .flat();

                // set agent conversation_id
                const chatUsers = users.data.map((user: any) => {
                    const convSession = convSessions.find(
                        (convSession: any) => convSession.socket_session_id == user.socket_sessions[0].id
                    );

                    if (convSession) {
                        user.conversation_id = convSession.conversation_id;
                    }

                    return user;
                });

                context.commit('storeUsers', chatUsers);

                resolve(chatUsers);
            });
        });
    },

    // update online users
    updateOnlineUsers(context, onlineUsers) {
        return new Promise((resolve) => {
            context.commit('updateOnlineUsers', onlineUsers);
            resolve(true);
        });
    },

    // store message which came from socket events
    storeMessage(context, messageRes) {
        const obj = {
            conv_id: messageRes.conversation.id,
            message: {
                id: messageRes.id,
                msg: messageRes.id,
                created_at: messageRes.created_at,
                attachments: messageRes.attachments,
                temp_id: messageRes.temp_id,
            },
            ai_is_replying: messageRes.ai_is_replying,
            sessions: messageRes.conversation.conversation_sessions,
            chat_department: messageRes.conversation.chat_department,
            from: 'socket',
        };

        return new Promise((resolve) => {
            context.commit('updateConversation', obj);
            resolve(true);
        });
    },

    clearClientChatInitiate(context) {
        context.commit('clearClientChatInitiate');
    },
};

export default actions;

// join/left/close like message information as array
function getConStateInfoAsMessageArray(convSess: any) {
    const agentConvStateInfoArray: any = [];
    const convStates = ['joined', 'left', 'closed'];

    convStates.forEach((convState) => {
        console.log(convSess[`${convState}_at`]);
        if (convSess[`${convState}_at`]) {
            //add left state created_at suffix cause join and left data come from same resource
            const leftStateSuffix = convState !== 'joined' ? `_${convState}` : '';

            agentConvStateInfoArray.push({
                ...convSess,
                id: `${convSess.id}${leftStateSuffix}`, // unique id to sort for left state
                actual_id: convSess.id, // if need later
                conv_state_status: convState,
                created_at: convSess[`${convState}_at`],
            });
        }
    });

    return agentConvStateInfoArray;
}

function getClosedInfoAsMessageArray(convStateRes: any) {
    const closedStateRes = _.cloneDeep(convStateRes.data);
    delete closedStateRes.conversation_sessions;

    closedStateRes.conversation_id = closedStateRes.id;

    return getConStateInfoAsMessageArray(closedStateRes);
}

// get what the state status by me (join/left)
function getConvJoinAndLeftStateStatus(convStateRes: any) {
    let convStateStatus = {};
    const mySocketSessionId = helpers.getMySocketSessionId();

    const convStates = ['joined', 'left'];
    convStates.forEach((convState) => {
        const findMyConvStateStatus = convStateRes.data.conversation_sessions.find(
            (convSession: any) => convSession[`${convState}_at`] && convSession.socket_session_id === mySocketSessionId
        );

        if (findMyConvStateStatus) {
            convStateStatus = {
                status: convState,
            };
        }
    });

    return convStateStatus;
}
