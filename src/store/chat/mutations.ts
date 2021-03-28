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

    storeChatRequest(state: ChatStateInterface, payload: any) {
        // check already exit this conv id into this array
        // [
        //     '9043284nrhte': [
        //     {},
        //     {}
        // ],
        //
        //     '9043284nrhte': [
        //     {},
        //     {}
        // ]
        // ]

        const existingChatReq = state.chatRequest;
        if (existingChatReq) {
            _.each(existingChatReq, function () {});
        }

        const chatReqObj: { [k: string]: any } = {};

        const convId = payload.conv_id;
        chatReqObj[convId] = payload;

        state.chatRequest.push(chatReqObj);
    },
};

export default mutation;
