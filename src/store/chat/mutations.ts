import { MutationTree } from 'vuex';
import { ChatStateInterface } from './state';

const mutation: MutationTree<ChatStateInterface> = {
    storeClientInitiateConvInfo(state: ChatStateInterface, payload: any) {
        const data = JSON.stringify(payload.data);
        localStorage.setItem('clientInitiateConvInfo', data);
        state.clientInitiateConvInfo = payload.data;
    },

    // get conversations messages and store into state which come from db
    // and store temp message from client and agent
    storeConvMessages(state: ChatStateInterface, payload: any) {
        if (!payload.messages.length) return;

        const convMessages = { messages: payload.messages, id: payload.messages[0].conversation_id };
        const convId = convMessages.id;

        if (!state.conversationInfo.hasOwnProperty(convId)) {
            state.conversationInfo[convId] = { messages: {} };
        }

        // store conversation messages
        convMessages.messages.forEach((message: any) => {
            state.conversationInfo[convId].messages[message.id] = message;
        });

        // store conversation state information (join/left/close)
        if (payload.convStateInfo) {
            state.conversationInfo[convId].stateInfo = payload.convStateInfo;
        }
    },

    // store chat requests into state which come from db
    storeChatRequests(state: ChatStateInterface, payload: any) {
        const chatRequests = payload.data;

        chatRequests.forEach((chatRequest: any) => {
            const convId = chatRequest.id;
            chatRequest.messages = chatRequest.messages[0];
            chatRequest.conv_id = convId;

            state.chatRequests[convId] = chatRequest;
        });
    },

    // store temp chat request
    storeTempChatRequest(state: ChatStateInterface, payload: any) {
        const convId = payload.conversation_id;

        payload.messages = payload.messages[0];
        payload.conv_id = convId;

        state.chatRequests[convId] = payload;
    },

    // store all agents into state which come from db
    storeAgents(state: ChatStateInterface, payload: any) {
        const chatAgents = payload.data;

        chatAgents.forEach((chatAgent: any) => {
            const agentId = chatAgent.id;

            state.chatAgents[agentId] = chatAgent;
        });
    },

    // store online agents into state which come from db
    storeOnlineAgents(state: ChatStateInterface, payload: any) {
        state.onlineChatAgents = payload.users;
    },

    clearClientChatInitiate(state: ChatStateInterface) {
        localStorage.clear();
        sessionStorage.clear();
        state.clientInitiateConvInfo = {};
    },
};

export default mutation;
