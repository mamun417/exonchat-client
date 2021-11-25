import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { ChatHistoryStateInterface } from "./state";
import { cloneDeep } from "lodash";
import Conversation from "src/store/models/Conversation";

const getters: GetterTree<ChatHistoryStateInterface, StateInterface> = {
    chatHistories(state) {
        const chatHistories = cloneDeep(state.chatHistories);

        chatHistories.forEach((history: any) => {
            history.connected_agents = Conversation.find(history.id)?.connectedUsers;
        });

        return chatHistories;
    },

    paginationMeta(state) {
        return state.paginationMeta;
    },

    pipeline(state) {
        return state.pipeline;
    },

    // newLoadedChatHistoriesIds(state) {
    //     return state.newLoadedChatHistoriesIds;
    // },
};

export default getters;
