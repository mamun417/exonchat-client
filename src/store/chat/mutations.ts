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
    // and store temp chat req from client
    storeChatRequests(state: ChatStateInterface, chatRequests: any) {
        chatRequests.forEach((chatRequest: any) => {
            const convId = chatRequest.conversation_id || chatRequest.id;

            chatRequest.messages = chatRequest.messages[0];
            chatRequest.conv_id = convId;

            state.chatRequests[convId] = chatRequest;
        });
    },

    // store all users into state
    storeUsers(state: ChatStateInterface, chatUsers: any) {
        chatUsers.forEach((chatUser: any) => {
            state.chatUsers[chatUser.socket_sessions[0].id] = chatUser;
        });
    },

    // update online users
    updateOnlineUsers(state: ChatStateInterface, onlineUsers: any) {
        Object.values(state.chatUsers).map((user: any) => {
            user.is_online = user.online_status && onlineUsers.includes(user.socket_sessions[0].id);
        });
    },

    updateConvIdToAChatUser(state: ChatStateInterface, data) {
        state.chatUsers[data.ses_id].conversation_id = data.conv_id;
    },

    clearClientChatInitiate(state: ChatStateInterface) {
        localStorage.clear();
        sessionStorage.clear();
        state.clientInitiateConvInfo = {};
    },
};

export default mutation;
