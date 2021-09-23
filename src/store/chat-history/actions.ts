import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { ChatHistoryStateInterface } from "./state";
import * as _l from "lodash";
import Conversation from "src/store/models/Conversation";
import moment from "moment";
import helpers from "boot/helpers/helpers";

const actions: ActionTree<ChatHistoryStateInterface, StateInterface> = {
    getChatHistories(context) {
        return new Promise((resolve, reject) => {
            window.api
                .post("conversations/chat-history", null, {
                    params: {
                        p: context.state.paginationMeta.current_page,
                        s: context.state.pipeline.s,
                        chat_department_id: context.state.pipeline.chat_department_id,
                        agent_id: context.state.pipeline.agent_id,
                        rating: context.state.pipeline.rating,
                    },
                })
                .then(async (res: any) => {
                    context.commit("updatePaginationMeta", res.data.chat_histories.pagination);

                    const chatHistoriesRes = res.data.chat_histories.data || [];

                    if (!chatHistoriesRes.length) {
                        resolve(chatHistoriesRes);
                    }

                    console.log(chatHistoriesRes);

                    await Conversation.insert({ data: chatHistoriesRes });

                    const mySocketSessionId = helpers.getMySocketSessionId();

                    const sortedChatHistories = _l
                        .sortBy(chatHistoriesRes, [(clientConv: any) => moment(clientConv.created_at).format("x")])
                        .reverse();

                    const chatHistories = sortedChatHistories.map((conv: any) => {
                        conv.client_info = conv.conversation_sessions.find((session: any) => {
                            return !conv.users_only && !session.socket_session.user;
                        });

                        conv.message = msgMaker(conv.messages);

                        conv.self_status = context.rootGetters["chat/conversationStatusForMe"](
                            conv.id,
                            mySocketSessionId
                        );

                        conv.connected_agents = Conversation.find(conv.id)?.connectedUsers;

                        return conv;
                    });

                    function msgMaker(messagesObj: any) {
                        if (messagesObj && Object.keys(messagesObj).length) {
                            const messages = _l.cloneDeep(Object.values(messagesObj));

                            const tempMsgObj: any = _l
                                .sortBy(
                                    Object.values(messages).filter(
                                        (msg: any) =>
                                            msg.sender_type !== "ai" ||
                                            msg.msg ||
                                            (msg.attachments && msg.attachments.length)
                                    ),
                                    [(msg: any) => moment(msg.created_at).format("x")]
                                )
                                .reverse()[0];

                            if (!tempMsgObj.msg) {
                                tempMsgObj.msg = "Uploaded Attachments";
                            }

                            return tempMsgObj;
                        }

                        return null;
                    }

                    resolve(chatHistories);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    updateCurrentPage(context, currentPage) {
        return new Promise((resolve) => {
            context.commit("updateCurrentPage", currentPage);
            resolve(true);
        });
    },

    updatePipeline(context, payload) {
        return new Promise((resolve) => {
            context.commit("updatePipeline", payload);
            context.commit("updateCurrentPage", 1);
            resolve(true);
        });
    },
};

export default actions;
