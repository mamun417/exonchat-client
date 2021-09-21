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

    clientsConversation: (state) => {
        return Object.values(state.conversations).filter((conv: any) => !conv.users_only);
    },

    teamConversation: (state) => {
        return Object.values(state.conversations).filter((conv: any) => conv.users_only);
    },

    conversations: (state) => {
        return state.conversations;
    },

    conversationInfo: (state) => (convId: any) => {
        if (state.conversations[convId]) {
            return _l.omit(state.conversations[convId], ["messages"]);
        }

        return {};
    },

    myConversationSession: () => (convId: any) => {
        const conv: any = Conversation.query().where("id", convId).first();

        return conv.myConversationSession || {};
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

    conversationMessages: (state) => (convId: any) => {
        return state.conversations[convId]?.messages || {};
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

    getConvSesStateAsMsg: (state) => (convId: any) => {
        const stateAsMsg: any = [];

        if (!state.conversations[convId]) return [];

        const conv = state.conversations[convId];

        if (conv.closed_at) {
            stateAsMsg.push({
                id: `${conv.closed_by.id}_closed`,
                state: "closed",
                session: conv.closed_by,
                conversation_id: convId,
                created_at: conv.closed_at,
                updated_at: conv.closed_at, // its for future
            });
        }

        if (conv.sessions && conv.sessions.length) {
            conv.sessions.forEach((convSes: any) => {
                ["joined", "left"].forEach((state: any) => {
                    if (convSes[`${state}_at`]) {
                        stateAsMsg.push({
                            id: `${convSes.socket_session_id}_${state}`,
                            state: state,
                            session: convSes.socket_session,
                            conversation_id: convId,
                            created_at: convSes[`${state}_at`],
                            updated_at: convSes[`${state}_at`], // its for future
                        });
                    }
                });
            });
        }

        return stateAsMsg;
    },

    // ongoing all chats => for interaction page
    ongoingAllChats(state) {
        const chats = Object.values(state.conversations)
            .filter((conv: any) => {
                return !conv.users_only && !conv.closed_at && conv.sessions.length > 1;
            })
            .map((conv: any) => {
                const client_info = _l.find(conv.sessions, (convSes: any) => !convSes.socket_session.user);

                return { conversation_session: conv.sessions[0], ...conv, client_info }; // conv.sessions[0] cz we are already filtering length 1
            });

        return _l.sortBy(chats, (conv: any) => moment(conv.created_at).format("x")).reverse();
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
                        (agentsLength.length === 1 && sesInfo.left_at))
                );
            })
            .map((conv: any) => {
                return {
                    connected_client: _l.find(conv.sessions, (convSes: any) => !convSes.socket_session.user),
                    connected_agents: conv.sessions.filter((convSes: any) => convSes.socket_session.user),
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

        return Object.values(allUsers).filter((user: any) => authInfo.email !== user.email);
    },

    previousConversations(state) {
        return state.previousConversations;
    },
};

export default getters;
