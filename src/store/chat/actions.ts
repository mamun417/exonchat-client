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
    storeConvState(context, convInfo) {
        let agentConvStateInfo = '';

        agentConvStateInfo = getConStateInfoAsMessageArray(convInfo);

        convInfo.messages = agentConvStateInfo;
        convInfo.convStateInfo = {
            status: convInfo.state_status,
        };

        context.commit('storeConvMessages', convInfo);
    },

    // get conversation messages from db
    async getAgentConvMessages(context, payload) {
        const getConvStateInfo = window.api.get(`conversations/${payload.convId}/sessions`),
            getConvMessages = window.api.get(`conversations/${payload.convId}/messages`);

        return await context.dispatch('storeConvMessages', { getConvStateInfo, getConvMessages });
    },

    // get client conversation messages from db
    async getClientConvMessages(context, payload) {
        const getConvStateInfo = window.clientSocketApi.get(`conversations/${payload.convId}/sessions`),
            getConvMessages = window.clientSocketApi.get(`conversations/${payload.convId}/messages`);

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
    storeTemporaryMessage(context, payload) {
        console.log(payload);
        window.clog('ddf', 'green');

        return new Promise((resolve) => {
            const data = {
                messages: [payload],
            };

            context.commit('storeConvMessages', data);
            resolve(true);
        });
    },

    // get chat requests form db
    getChatRequests(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get('conversations/requests/list')
                .then((res: any) => {
                    context.commit('storeChatRequests', res.data);
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

    // get agents with conversation_id form db
    getAgents(context) {
        return new Promise((resolve) => {
            const getAllUserToUserConvWithMe = window.userSocketApi.get('conversations/user-to-user/me'),
                getAgents = window.api.get('users/active');

            Promise.all([getAllUserToUserConvWithMe, getAgents]).then(([allUserToUserConvWithMe, agents]) => {
                // collect convSessions array
                const convSessions = allUserToUserConvWithMe.data
                    .map((singleConvWithMe: any) => {
                        return singleConvWithMe.conversation_sessions;
                    })
                    .flat();

                // set agent conversation_id
                const chatAgents = agents.data.map((agent: any) => {
                    const agentConvSession = convSessions.find(
                        (convSession: any) => convSession.socket_session_id == agent.socket_sessions[0].id
                    );

                    if (agentConvSession) {
                        agent.conversation_id = agentConvSession.conversation_id;
                    }

                    return agent;
                });

                context.commit('storeAgents', chatAgents);

                resolve(chatAgents);
            });
        });
    },

    // get online agents form db
    getOnlineAgents(context, onlineAgentRes) {
        return new Promise((resolve) => {
            context.commit('getOnlineAgents', onlineAgentRes);
            resolve(true);
        });
    },

    clearClientChatInitiate(context) {
        context.commit('clearClientChatInitiate');
    },

    // if need later
    // createUserToUserConversation(context, payload) {
    //     return new Promise((resolve, reject) => {
    //         window.api
    //             .post('conversations', payload.params)
    //             .then((res: any) => {
    //                 window.clog('response paici', 'green');
    //                 console.log(res);
    //                 // context.commit('createUserToUserConversation', res.data);
    //                 // resolve(res);
    //             })
    //             .catch((err: any) => {
    //                 reject(err);
    //             });
    //     });
    // },
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
