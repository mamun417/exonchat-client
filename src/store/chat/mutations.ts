// import { _l } from 'src/boot/helpers';
import { MutationTree } from 'vuex';
import { ChatStateInterface } from './state';

const mutation: MutationTree<ChatStateInterface> = {
    someMutation(/* state: ChatStateInterface */) {
        // your code
    },

    storeConvInfo(state: ChatStateInterface, payload: any) {
        console.log(payload);

        const data = JSON.stringify(payload.data);
        localStorage.setItem('convInfo', data);
        state.convInfo = payload.data;
    },

    setConvState(state: ChatStateInterface, payload: any) {
        const data = JSON.stringify(payload.data);
        localStorage.setItem('convStateInfo', data);
        state.convStateInfo = payload.data;
    },

    // get conversations messages into state which come from db
    storeConvMessages(state: ChatStateInterface, payload: any) {
        const convMessages = { messages: payload.data, id: payload.data[0].conversation_id };
        const convId = convMessages.id;

        if (!state.messages.hasOwnProperty(convId)) {
            state.messages[convId] = { messages: {} };
        }

        convMessages.messages.forEach((message: any) => {
            state.messages[convId].messages[message.id] = message;
        });
    },

    // store temp message
    storeTemporaryMessage(state: ChatStateInterface, payload: any) {
        const convId = payload.conversation_id;
        const msgId = payload.id;

        if (!state.messages.hasOwnProperty(convId)) {
            state.messages[convId] = {
                messages: {
                    [msgId]: { id: payload.tempId, ...payload },
                },
            };
        } else {
            state.messages[convId]['messages'][msgId] = payload;
        }
    },

    // store chat requests into state which come from db
    storeChatRequests(state: ChatStateInterface, payload: any) {
        const chatRequests = payload.data;

        chatRequests.forEach((chatRequest: any) => {
            const convId = chatRequest.id;

            state.chatRequests[convId] = {
                msg: chatRequest.messages[0].msg,
                createdAt: chatRequest.created_at,
                convId,
            };
        });
    },

    // store temp chat request
    storeTempChatRequest(state: ChatStateInterface, payload: any) {
        const convId = payload.conversation_id;

        state.chatRequests[convId] = {
            msg: payload.msg,
            createdAt: payload.created_at,
            convId,
        };
    },

    // store agents into state which come from db
    storeAgents(state: ChatStateInterface, payload: any) {
        state.chatAgents = payload.data;
    },
};

export default mutation;
