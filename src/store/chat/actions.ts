import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatStateInterface } from './state';

const actions: ActionTree<ChatStateInterface, StateInterface> = {
    storeClientInitiateConvInfo(context, payload) {
        context.commit('storeClientInitiateConvInfo', payload);
    },

    // get conversations which joined by me
    getJoinedConversations(context, payload) {
        context.commit('storeJoinedConversation', payload);
    },

    // conversation state like (joined, left, close)
    storeConvState(context, payload) {
        context.commit('storeConvState', payload);
    },

    // get conversation messages from db
    async getConvMessages(context, payload) {
        const getConvJoinInfo = window.api.get(`conversations/${payload.convId}/sessions`),
            getConvMessages = window.api.get(`conversations/${payload.convId}/messages`);

        return await context.dispatch('manageConvMessages', { getConvJoinInfo, getConvMessages });
    },

    // get client conversation messages from db
    async getClientConvMessages(context, payload) {
        const getConvJoinInfo = window.clientApi.get(`conversations/${payload.convId}/sessions`),
            getConvMessages = window.clientApi.get(`conversations/${payload.convId}/messages`);

        return await context.dispatch('manageConvMessages', { getConvJoinInfo, getConvMessages });
    },

    manageConvMessages(context, { getConvJoinInfo, getConvMessages }) {
        return new Promise((resolve, reject) => {
            Promise.all([getConvJoinInfo, getConvMessages])
                .then((res) => {
                    const convStateRes = res[0]; // join/left/close
                    const messagesRes = res[1];

                    // remove client joining information
                    // set conversation state status (join/left)
                    // Note: need to manage conversation close status
                    const onlyAgentConvStateRes = convStateRes.data.conversation_sessions
                        .filter((convSession: any) => convSession.socket_session.user)
                        .map((filteredConvSession: any) => {
                            const agentConvStateInfo: any = [];
                            const convStates = ['joined', 'left'];

                            convStates.forEach((convState) => {
                                if (filteredConvSession[`${convState}_at`]) {
                                    //add left state created_at suffix cause join and left data come from same resource
                                    const leftStateSuffix = `${convState == 'left' ? '_left' : ''}`;

                                    agentConvStateInfo.push({
                                        ...filteredConvSession,
                                        id: `${filteredConvSession.id}${leftStateSuffix}`, // unique id to sort for left state
                                        actual_id: filteredConvSession.id, // if need later
                                        conv_state_status: convState,
                                        created_at: filteredConvSession[`${convState}_at`],
                                    });
                                }
                            });

                            return agentConvStateInfo;
                        })
                        .flat(); // 1 level flat

                    messagesRes.data = messagesRes.data.concat(onlyAgentConvStateRes);

                    context.commit('storeConvMessages', messagesRes);

                    resolve(messagesRes);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    storeTemporaryMessage(context, payload) {
        return new Promise((resolve) => {
            context.commit('storeTemporaryMessage', payload);
            resolve(true);
        });
    },

    // get chat requests form db
    getChatRequests(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get('conversations/requests/list')
                .then((res: any) => {
                    context.commit('storeChatRequests', res);
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
            context.commit('storeTempChatRequest', payload);
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
};

export default actions;
