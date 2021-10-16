import moment from "moment";
import * as _l from "lodash";
import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { ChatStateInterface } from "./state";

import ChatDepartment from "src/store/models/ChatDepartment";
import Conversation from "src/store/models/Conversation";

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

    conversationStatusForMe: () => (convId: any, mySesId: any) => {
        const conv: any = Conversation.query().where("id", convId).with("conversation_sessions").first();

        if (!conv) return null;
        if (conv.closed_at) return "closed";

        const conversationSession =
            _l.find(
                conv.conversation_sessions,
                (conversationSession: any) => conversationSession.socket_session_id === mySesId
            ) || {};

        return conversationSession.left_at ? "left" : conversationSession.joined_at ? "joined" : null;
    },

    conversationWithUsersInfo: (state) => (convId: any, mySesId: any) => {
        let userSessions = [];

        const conv = state.conversations[convId];

        if (conv?.id) {
            userSessions = conv.sessions.filter((session: any) => {
                return (
                    (!conv.users_only && !session.socket_session.user) ||
                    (conv.users_only && session.socket_session_id !== mySesId)
                );
            });
        }

        return userSessions;
    },

    // connected agents
    conversationConnectedUsers: (state) => (convId: any) => {
        let userSessions: any = [];

        if (state.conversations[convId]) {
            const conv = state.conversations[convId];

            // send connected users in this conversation without client. its for showing images
            userSessions = conv.sessions.filter((session: any) => {
                return (!conv.users_only && session.socket_session.user) || conv.users_only;
            });
        }

        return userSessions;
    },

    typingState: (state) => (convId: any) => {
        const typingState: any = state.typingStates[convId];
        const conv = state.conversations[convId];

        if (!typingState || !conv) return [];

        const typingRes: any = [];

        Object.values(typingState).forEach((each: any) => {
            const sesInfo = _l.find(conv.sessions, ["socket_session_id", each.socket_session_id]);

            if (sesInfo) {
                typingRes.push({
                    ...each,
                    conv_ses_info: sesInfo,
                    socket_session: sesInfo.socket_session,
                });
            }
        });

        return typingRes;
    },

    // ongoing other chats => for interaction page
    ongoingOtherChats(state, getters, rootState, rootGetters) {
        const chats = Object.values(state.conversations)
            .filter((conv: any) => {
                const sesInfo = _l.find(conv.sessions, [
                    "socket_session_id",
                    rootGetters["auth/profile"]?.socket_session?.id,
                ]);

                const agentsLength = conv.sessions.filter(
                    (convSes: any) => convSes.socket_session.user && convSes.joined_at
                );

                return (
                    !conv.users_only &&
                    !conv.closed_at &&
                    (agentsLength.length > 1 ||
                        (agentsLength.length === 1 && !sesInfo) ||
                        (agentsLength.length === 1 && sesInfo.left_at) ||
                        (agentsLength.length === 1 && !sesInfo.left_at && !sesInfo.joined_at))
                );
            })
            .map((conv: any) => {
                return {
                    connected_client: _l.find(conv.sessions, (convSes: any) => !convSes.socket_session.user),
                    connected_agents: conv.sessions.filter(
                        (convSes: any) => convSes.socket_session.user && convSes.joined_at
                    ),
                    ...conv,
                };
            });

        return _l.sortBy(chats, (conv: any) => moment(conv.created_at).format("x")).reverse();
    },

    // chat requests for me => for left bar & interaction page
    incomingChatRequests() {
        return Conversation.query()
            .where("users_only", false)
            .where("closed_at", null)
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
        const myTransferRequest = Object.values(state.conversations)
            .filter((conv: any) => {
                const sesInfo = _l.find(conv.sessions, [
                    "socket_session_id",
                    rootGetters["auth/profile"]?.socket_session?.id,
                ]);

                // Object.keys(conv.messages).length check for safe
                // omitting left_at null check for now. if need null check modify event api also
                return (
                    !conv.users_only &&
                    !conv.closed_at &&
                    sesInfo &&
                    !sesInfo.joined_at &&
                    sesInfo.type === "chat_transfer"
                );
            })
            .map((conv: any) => {
                // it holds transfer info in the info object
                const sesInfo = _l.find(conv.sessions, [
                    "socket_session_id",
                    rootGetters["auth/profile"]?.socket_session?.id,
                ]);

                return { ...conv, transfer_request_info: sesInfo };
            });

        return _l.sortBy(myTransferRequest, (conv: any) => moment(conv.updated_at).format("x"));
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
        const allUsers = state.chatUsers;

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
