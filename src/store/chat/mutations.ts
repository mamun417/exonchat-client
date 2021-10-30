import { MutationTree } from "vuex";
import { ChatStateInterface } from "./state";
import * as _l from "lodash";
import Conversation from "src/store/models/Conversation";
import Message from "src/store/models/Message";
import ConversationSession from "src/store/models/ConversationSession";

const mutation: MutationTree<ChatStateInterface> = {
    storeClientInitiateConvInfo(state: ChatStateInterface, payload: any) {
        const data = JSON.stringify(payload.data);
        localStorage.setItem("clientInitiateConvInfo", data);
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
            state.chatUsers[chatUser.socket_session.id] = chatUser;
        });
    },

    // update online users
    updateOnlineUsers(state: ChatStateInterface, socketUsers: any) {
        Object.values(state.chatUsers).map((user: any) => {
            const socketUser = socketUsers[user.socket_session.id];

            if (!socketUser) {
                user.online_status = "logout";
            } else {
                user.online_status = socketUser.online_status;
            }
        });
    },

    updateConversation(state: ChatStateInterface, convData: any) {
        const convId = convData.conv_id;

        if (convId) {
            if (!state.conversations[convId]?.id) {
                state.conversations[convId] = {
                    scroll_info: {},
                };
            }

            if (convData.hasOwnProperty("ai_is_replying")) {
                state.conversations[convId].ai_is_replying = convData.ai_is_replying;
            }

            if (convData.hasOwnProperty("notify_status")) {
                state.conversations[convId].notify_status = convData.notify_status;
            }

            if (convData.hasOwnProperty("pagination_meta")) {
                state.conversations[convId].pagination_meta = convData.pagination_meta;
            }

            if (convData.hasOwnProperty("scroll_info")) {
                state.conversations[convId].scroll_info = convData.scroll_info;
            }

            if (convData.hasOwnProperty("current_loading_conv_info")) {
                state.conversations[convId].current_loading_conv_info = convData.current_loading_conv_info;
            }

            if (convData.hasOwnProperty("prev_loaded_id")) {
                // store current & loaded ids
                if (!state.conversations[convId].hasOwnProperty("prev_loaded_ids")) {
                    state.conversations[convId].prev_loaded_ids = [convData.prev_loaded_id];
                    state.conversations[convId].current_loading_conv_info = {
                        conv_id: convData.prev_loaded_id,
                    };
                } else {
                    if (!state.conversations[convId].prev_loaded_ids.includes(convData.prev_loaded_id)) {
                        state.conversations[convId].prev_loaded_ids.push(convData.prev_loaded_id);
                        state.conversations[convId].current_loading_conv_info = {
                            conv_id: convData.prev_loaded_id,
                        };
                    }
                }
            }
        }
    },

    updateConvSesInfo(state: ChatStateInterface, data: any) {
        const convId = data.conv_id;
        const conv = state.conversations[convId];

        if (conv) {
            if (data.payload_type === "conversation_session") {
                if (data.action === "chat_transfer_sent") {
                    const convSession = data.conv_ses_obj;

                    // remove then assign full conversation session object for safe update
                    _l.remove(conv.sessions, (convSes: any) => convSes.id === convSession.id);

                    conv.sessions.push(convSession);
                } else if (data.action === "chat_transfer_rejected") {
                    const convSession = data.conv_ses_obj;

                    // remove then assign full conversation session object for safe update
                    _l.remove(conv.sessions, (convSes: any) => convSes.id === convSession.id);
                }
            }
        }
    },

    updateConversationUserAvatar(state: ChatStateInterface, data: any) {
        const convId = data.conv_id;

        if (convId) {
            const conv = state.conversations[convId];

            data.srcs.forEach((srcObj: any) => {
                const foundSes = _l.find(conv.sessions, ["id", srcObj.conv_ses_id]);

                if (foundSes) {
                    foundSes.socket_session.user.user_meta.src = srcObj.src;
                }
            });
        }
    },

    updateTypingState(state: ChatStateInterface, typingStateObj: any) {
        const convId = typingStateObj.conv_id;
        const sesId = typingStateObj.session_id;

        if (!state.typingStates.hasOwnProperty(convId)) {
            state.typingStates[convId] = {};
        }

        if (!state.typingStates[convId][sesId]?.socket_session_id) {
            state.typingStates[convId][sesId] = {
                msg: typingStateObj.msg,
                time: Date.now(),
                socket_session_id: sesId,
                conversation_id: convId,
            };
        } else {
            state.typingStates[convId][sesId].msg = typingStateObj.msg;
            state.typingStates[convId][sesId].time = Date.now();
            state.typingStates[convId][sesId].socket_session_id = sesId;
            state.typingStates[convId][sesId].conversation_id = convId;
            state.typingStates[convId][sesId].status = typingStateObj.status;
        }
    },

    updateConvIdToAChatUser(state: ChatStateInterface, data) {
        state.chatUsers[data.ses_id].conversation_id = data.conv_id;
    },

    clearClientChatInitiate(state: ChatStateInterface) {
        localStorage.clear();
        sessionStorage.clear();
        state.clientInitiateConvInfo = {};
    },

    showRatingForm(state: ChatStateInterface, ratingFormState) {
        localStorage.setItem("showRatingForm", ratingFormState);
        state.clientInitiateConvInfo.showRatingForm = ratingFormState;
    },

    storePreviousConversations(state: ChatStateInterface, previousConversations: any) {
        if (!state.previousConversations.hasOwnProperty(previousConversations.parent_conv_id)) {
            state.previousConversations[previousConversations.parent_conv_id] = {};
        }

        previousConversations.data.forEach((previousConv: any) => {
            if (!state.previousConversations[previousConversations.parent_conv_id].hasOwnProperty(previousConv.id)) {
                state.previousConversations[previousConversations.parent_conv_id][previousConv.id] = previousConv;
            }
        });
    },
};

export default mutation;
