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

    storeTemporaryMessage(state: ChatStateInterface, payload: any) {
        state.messages.push(payload);
    },

    storeConvMessages(state: ChatStateInterface, payload: any) {
        console.log(payload);

        // state.chatRequest[convId] = {
        //     msg: payload.msg,
        //     createdAt: payload.created_at,
        //     convId,
        // };
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
