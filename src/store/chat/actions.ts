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
        const getConvJoinInfo = window.api.get(`conversations/${payload.convId}/sessions`),
            getConvMessages = window.api.get(`conversations/${payload.convId}/messages`);

        return await context.dispatch('storeConvMessages', { getConvJoinInfo, getConvMessages });
    },

    // get client conversation messages from db
    async getClientConvMessages(context, payload) {
        const getConvJoinInfo = window.clientApi.get(`conversations/${payload.convId}/sessions`),
            getConvMessages = window.clientApi.get(`conversations/${payload.convId}/messages`);

        return await context.dispatch('storeConvMessages', { getConvJoinInfo, getConvMessages });
    },

    storeConvMessages(context, { getConvJoinInfo, getConvMessages }) {
        return new Promise((resolve, reject) => {
            Promise.all([getConvJoinInfo, getConvMessages])
                .then((res) => {
                    const convStateRes = res[0]; // join/left/close
                    const messagesRes = res[1];

                    // remove client joining information
                    const agentState = convStateRes.data.conversation_sessions.filter(
                        (convSession: any) => convSession.socket_session.user
                    );

                    let onlyAgentConvStateRes = agentState
                        .map((filteredConvSession: any) => {
                            return getConStateInfoAsMessageArray(filteredConvSession);
                        })
                        .flat();

                    // some time state will be null, cause when client send message but no agent join the conversation
                    // then client reload the page no need this functionality to create state information
                    if (agentState.length) {
                        if (convStateRes.data.closed_at) {
                            onlyAgentConvStateRes = onlyAgentConvStateRes.concat(
                                getClosedInfoAsMessageArray(convStateRes)
                            );

                            messagesRes.convStateInfo = { status: 'closed' };
                        } else {
                            messagesRes.convStateInfo = getConvJoinAndLeftStateStatus(convStateRes);
                        }
                    }

                    messagesRes.messages = messagesRes.data.concat(onlyAgentConvStateRes);

                    context.commit('storeConvMessages', messagesRes);

                    resolve(messagesRes);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // using for both user and client
    storeTemporaryMessage(context, payload) {
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
                    window.clog(err, 'green');
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

    // get chat requests form db
    getAgents(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get('users/active')
                .then((res: any) => {
                    context.commit('storeAgents', res);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // get online agents form db
    storeOnlineAgents(context, payload) {
        return new Promise((resolve) => {
            context.commit('storeOnlineAgents', payload);
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
    const closedStateRes = _.cloneDeep(convStateRes.data);
    delete closedStateRes.conversation_sessions;

    window.clog('dsds', 'green');
    console.log(closedStateRes);

    closedStateRes.conversation_id = closedStateRes.id;

    return getConStateInfoAsMessageArray(closedStateRes);
}

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
