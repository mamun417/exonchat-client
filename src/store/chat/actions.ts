import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';
import helpers from 'boot/helpers/helpers';
import * as _l from 'lodash';

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

    // get client conversation messages from db
    async getClientConvMessages(context, payload) {
        const getConvStateInfo = window.socketSessionApi.get(`conversations/${payload.convId}/sessions`),
            getConvMessages = window.socketSessionApi.get(`conversations/${payload.convId}/messages`);

        return await context.dispatch('storeConvMessages', { getConvStateInfo, getConvMessages });
    },

    // store conversation messages into state, so that getters can get the result
    getConvMessages(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .get(`conversations/${payload.convId}/messages?pp=50`)
                .then((res: any) => {
                    const conv = res.data;

                    context.commit('updateConversation', {
                        conv_id: conv.id,
                        conversation: _l.pick(conv, [
                            'id',
                            'users_only',
                            'type',
                            'closed_at',
                            'created_by_id',
                            'closed_by_id',
                        ]),
                        sessions: conv.conversation_sessions,
                        chat_department: conv.chat_department,
                        // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                        // if later we implement other way then review this
                        messages: conv.messages,
                        ai_is_replying: conv.ai_is_replying,
                    });

                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // get chat requests form db
    getChatRequests(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get('conversations/requests/list')
                .then((res: any) => {
                    const chatRequests = res.data;

                    chatRequests.forEach((request: any) => {
                        context.commit('updateConversation', {
                            conv_id: request.id,
                            conversation: _l.pick(request, [
                                'id',
                                'users_only',
                                'type',
                                'closed_at',
                                'created_by_id',
                                'closed_by_id',
                            ]),
                            sessions: request.conversation_sessions,
                            chat_department: request.chat_department,
                            // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                            // if later we implement other way then review this
                            message: request.messages[0],
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
        const tempConv = messageRes.conversation;

        const obj = {
            conv_id: tempConv.id,
            conversation: _l.pick(tempConv, ['id', 'users_only', 'type', 'closed_at', 'created_by_id', 'closed_by_id']),
            message: {
                id: messageRes.id,
                msg: messageRes.msg,
                created_at: messageRes.created_at,
                attachments: messageRes.attachments,
                temp_id: messageRes.temp_id,
            },
            ai_is_replying: messageRes.ai_is_replying,
            sessions: tempConv.conversation_sessions,
            chat_department: tempConv.chat_department,
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
    const closedStateRes = _l.cloneDeep(convStateRes.data);
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

export default actions;
