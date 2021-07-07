import { MutationTree } from 'vuex';
import { ChatStateInterface } from './state';
import * as _l from 'lodash';

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
    updateOnlineUsers(state: ChatStateInterface, socketUsers: any) {
        Object.values(state.chatUsers).map((user: any) => {
            if (socketUsers[0]?.db_change) {
                if (socketUsers[0].ses_id === user.socket_sessions[0].id) {
                    user.online_status = socketUsers[0].online_status;
                }
            } else {
                const foundSocketUser = _l.find(socketUsers, ['ses_id', user.socket_sessions[0].id]);

                if (user.online_status === 'online' && !foundSocketUser) {
                    user.online_status = 'offline';
                }
            }
        });
    },

    updateConversation(state: ChatStateInterface, convData: any) {
        // console.log('>>>>>>>', convData.caller, convData.conversation);

        const convId = convData.conv_id;

        if (convId) {
            const conv = state.conversations[convId];

            if (!state.conversations[convId]?.id) {
                state.conversations[convId] = { ...convData.conversation, messages: {}, sessions: [], loading: false };
            }

            if (convData.closed_by) {
                state.conversations[convId].closed_at = convData.closed_at;
                state.conversations[convId].closed_by_id = convData.closed_by.id;
                state.conversations[convId].closed_by = convData.closed_by;
            }

            if (convData.hasOwnProperty('chat_department')) {
                state.conversations[convId].chat_department = convData.chat_department;
            }

            if (convData.hasOwnProperty('ai_is_replying')) {
                state.conversations[convId].ai_is_replying = convData.ai_is_replying;
            }

            if (convData.hasOwnProperty('message') && convData.message) {
                if (!state.conversations[convId].messages.hasOwnProperty(convData.message.id)) {
                    // console.log(convData.message);

                    state.conversations[convId].messages[convData.message.id] = convData.message;
                } else {
                    // later check for update time & replace
                }
            }

            if (convData.hasOwnProperty('messages') && convData.messages.length) {
                convData.messages.forEach((message: any) => {
                    if (!state.conversations[convId].messages.hasOwnProperty(message.id)) {
                        // console.log(convData.message);

                        state.conversations[convId].messages[message.id] = message;
                    } else {
                        // later check for update time & replace
                    }
                });
            }

            // here sessions means [conversation_session...]
            if (convData.hasOwnProperty('sessions') && convData.sessions.length) {
                if (state.conversations[convId].sessions.length) {
                    // later
                    convData.sessions.forEach((session: any) => {
                        const foundSes = _l.find(state.conversations[convId].sessions, ['id', session.id]);

                        if (foundSes) {
                            // this check will try to update latest. cz if left_at then its always latest
                            if (session.left_at) {
                                foundSes.left_at = session.left_at;
                            }

                            // add other check & add for socket_session name update etc
                        } else {
                            state.conversations[convId].sessions.push(session);
                        }
                    });
                } else {
                    state.conversations[convId].sessions = convData.sessions;
                }
            }

            // here session means conversation_session
            if (convData.hasOwnProperty('session')) {
                const convSession = convData.session;

                const foundSes = _l.find(conv.sessions, ['id', convSession.id]);

                if (foundSes) {
                    // this check will try to update latest. cz if left_at then its always latest
                    if (convSession.left_at) {
                        foundSes.left_at = convSession.left_at;
                    }

                    // add other check & add for socket_session name update etc
                } else {
                    conv.sessions.push(convSession);
                }
            }

            if (convData.hasOwnProperty('rating')) {
                state.conversations[convId].rating = convData.rating;
            }

            if (convData.hasOwnProperty('notify_status')) {
                state.conversations[convId].notify_status = convData.notify_status;
            }

            if (convData.hasOwnProperty('pagination_meta')) {
                state.conversations[convId].pagination_meta = convData.pagination_meta;
            }

            if (convData.hasOwnProperty('scroll_info')) {
                state.conversations[convId].scroll_info = convData.scroll_info;
            }

            if (convData.hasOwnProperty('last_msg_seen_time')) {
                const convSession = conv.sessions.find(
                    (session: any) => session.socket_session_id === convData.socket_session_id
                );

                if (convSession) {
                    convSession.last_msg_seen_time = convData.last_msg_seen_time;
                }
            }
        }
    },

    updateConversationUserAvatar(state: ChatStateInterface, data: any) {
        const convId = data.conv_id;

        if (convId) {
            const conv = state.conversations[convId];

            data.srcs.forEach((srcObj: any) => {
                const foundSes = _l.find(conv.sessions, ['id', srcObj.conv_ses_id]);

                if (foundSes) {
                    foundSes.socket_session.user.user_meta.src = srcObj.src;
                }
            });
        }
    },

    updateChatUsersAvatar(state: ChatStateInterface, data: any) {
        if (data.length) {
            data.forEach((srcObj: any) => {
                const foundUser = _l.find(state.chatUsers, ['id', srcObj.user_id]);

                if (foundUser) {
                    foundUser.user_meta.src = srcObj.src;
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

        if (!state.typingStates[convId].hasOwnProperty(sesId)) {
            state.typingStates[convId][sesId] = {
                msg: typingStateObj.msg,
                time: Date.now(),
                socket_session_id: sesId,
            };
        } else {
            state.typingStates[convId][sesId].msg = typingStateObj.msg;
            state.typingStates[convId][sesId].time = Date.now();
            state.typingStates[convId][sesId].socket_session_id = sesId;
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
        localStorage.setItem('showRatingForm', ratingFormState);
        state.clientInitiateConvInfo.showRatingForm = ratingFormState;
    },
};

export default mutation;
