import moment from "moment";
import * as _l from "lodash";
import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { ChatStateInterface } from "./state";

import ChatDepartment from "src/store/models/ChatDepartment";
import Conversation from "src/store/models/Conversation";
import ConversationSession from "src/store/models/ConversationSession";
import SocketSession from "src/store/models/SocketSession";
import User from "src/store/models/User";
import { socketSessionApi } from "boot/axios";
import { cloneDeep } from "lodash";

const getters: GetterTree<ChatStateInterface, StateInterface> = {
    clientInitiateConvInfo(state) {
        return state.clientInitiateConvInfo;
    },

    teamConversation: (state) => {
        return Object.values(state.conversations).filter((conv: any) => conv.users_only);
    },

    conversationInfo: (state) => (convId: any) => {
        if (state.conversations[convId]) {
            return state.conversations[convId];
        }

        return {};
    },

    conversationStatusForMe: () => (convId: any) => {
        const conv: any = Conversation.query().where("id", convId).with("conversation_sessions").first();

        if (!conv) return null;
        if (conv.closed_at) return "closed";

        const conversationSession = conv.myConversationSession;

        return conversationSession.left_at ? "left" : conversationSession.joined_at ? "joined" : null;
    },

    typingState: (state) => (convId: any) => {
        return state.typingStates[convId];
    },

    // ongoing other chats => for interaction page
    ongoingOtherChats() {
        const conversations = Conversation.query()
            .where("users_only", false)
            .where("closed_at", null)
            .with("chat_department")
            .orderBy("created_at", "desc")
            .get();

        return conversations.filter((conv: any) => {
            const connectedAgents = conv.connectedUsers;
            const myConversationSession = conv.myConversationSession;

            return (
                connectedAgents.length > 1 ||
                (connectedAgents.length === 1 && !myConversationSession) ||
                (connectedAgents.length === 1 && myConversationSession.left_at) ||
                (connectedAgents.length === 1 && !myConversationSession.left_at && !myConversationSession.joined_at)
            );
        });
    },

    // chat requests for me => for left bar & interaction page
    incomingChatRequests() {
        return Conversation.query()
            .where("users_only", false)
            .where("closed_at", null)
            .where("type", (value: any) => value !== "facebook_chat")
            .whereHasNot("conversation_sessions", (conversationSessionQuery) => {
                conversationSessionQuery.whereHasNot("socket_session", (socketSessionQuery) => {
                    socketSessionQuery.where("user_id", null);
                });
            })
            .with("chat_department")
            .get();
    },

    incomingChatRequestsForMe(state, getters, rootState, rootGetters) {
        return getters.incomingChatRequests.filter((conv: any) =>
            _l.find(rootGetters["auth/profile"].chat_departments, ["tag", conv?.chat_department?.tag])
        );
    },

    // my running chats => for left bar & interaction page
    myOngoingChats(state, getters, rootState, rootGetters) {
        return Conversation.query()
            .where("users_only", false)
            .where("closed_at", null)
            .where("type", (value: any) => value !== "facebook_chat")
            .whereHas("conversation_sessions", (conversationSessionQuery) => {
                conversationSessionQuery
                    .where("joined_at", (value: any) => value)
                    .where("left_at", null)
                    .whereHas("socket_session", (socketSessionQuery) => {
                        socketSessionQuery
                            .where("user_id", (value: any) => value)
                            .where("id", rootGetters["auth/profile"]?.socket_session?.id);
                    });
            })
            .with("chat_department")
            .orderBy("created_at")
            .get();
    },

    myChatTransferRequests(state, getters, rootState, rootGetters) {
        return Conversation.query()
            .where("users_only", false)
            .where("closed_at", null)
            .whereHas("conversation_sessions", (conversationSessionQuery) => {
                conversationSessionQuery
                    .where("joined_at", null)
                    .where("type", "chat_transfer")
                    .where("socket_session_id", rootGetters["auth/profile"]?.socket_session?.id);
            })
            .with("chat_department")
            .orderBy("updated_at")
            .get();
    },

    // departmental chat requests count => for left bar
    departmentalOngoingChats() {
        const departmentalChats = ChatDepartment.query()
            .with("conversations", (query) => {
                query.where("users_only", false).where("closed_at", null);
            })
            .get();

        return _l.keyBy(departmentalChats, "id");
    },

    // teammates => for left bar
    chatUsers(state, getters, rootState, rootGetters) {
        const allUsers = cloneDeep(state.chatUsers);

        // load attachment src from User entity
        Object.keys(allUsers).forEach((userSocketSesId: string) => {
            const user = allUsers[userSocketSesId];

            const entityUserWithAttachmentSrc = User.query().where("id", user.id).first();

            if (user.user_meta.attachment) {
                user.user_meta.attachment.src = entityUserWithAttachmentSrc?.user_meta?.src || "";
            }
        });

        const authInfo = rootGetters["auth/profile"];

        const users = Object.values(allUsers).filter((user: any) => authInfo.id !== user.id);

        const sortByName = _l.sortBy(users, [(user: any) => user.user_meta.display_name]).reverse();

        return _l
            .sortBy(sortByName, [
                (user: any) => user.online_status === "online",
                (user: any) => user.online_status === "offline",
                (user: any) => user.online_status === "invisible",
            ])
            .reverse();
    },

    meAsChatUser(state, getters, rootState, rootGetters) {
        const allUsers = state.chatUsers;

        const authInfo = rootGetters["auth/profile"];

        return Object.values(allUsers).find((user: any) => authInfo.id === user.id);
    },

    allAgent(state) {
        const allUsers = state.chatUsers;

        return Object.values(allUsers);
    },

    previousConversations(state) {
        return state.previousConversations;
    },
};

export default getters;
