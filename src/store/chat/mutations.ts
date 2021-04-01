// import { _l } from 'src/boot/helpers';
import { MutationTree } from 'vuex';
import { ChatStateInterface } from './state';

const mutation: MutationTree<ChatStateInterface> = {
    someMutation(/* state: ChatStateInterface */) {
        // your code
    },

    setConvState(state: ChatStateInterface, payload: any) {
        const data = JSON.stringify(payload.data);
        localStorage.setItem('convStateInfo', data);
        state.convStateInfo = payload.data;
    },

    // get conversations messages from databases
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

    // store tem message
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

    storeChatRequest(state: ChatStateInterface, payload: any) {
        const convId = payload.conversation_id;

        state.chatRequest[convId] = {
            msg: payload.msg,
            createdAt: payload.created_at,
            convId,
        };
    },
};

export default mutation;
