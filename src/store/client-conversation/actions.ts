import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { ClientConversationStateInterface } from "./state";
import * as _l from "lodash";

const actions: ActionTree<ClientConversationStateInterface, StateInterface> = {
    getClientConversations(context) {
        return new Promise((resolve, reject) => {
            window.api
                .post("conversations/clients-conversation", null, {
                    params: {
                        p: context.state.paginationMeta.current_page,
                        s: context.state.pipeline.s,
                    },
                })
                .then((res: any) => {
                    context.commit("updatePaginationMeta", res.data.conversations.pagination);

                    const clientConvs = res.data.conversations.data || [];

                    context.commit(
                        "updateNewLoadedConversationIds",
                        clientConvs.map((conv: any) => conv.id)
                    );

                    clientConvs.forEach((conv: any) => {
                        context.commit(
                            "chat/updateConversation",
                            {
                                conv_id: conv.id,
                                conversation: _l.pick(conv, [
                                    "id",
                                    "users_only",
                                    "type",
                                    "closed_at",
                                    "created_by_id",
                                    "closed_by_id",
                                    "created_at",
                                ]),
                                sessions: conv.conversation_sessions,
                                chat_department: conv.chat_department,
                                // now for sure that at least 1 msg will be available. cz ai will reply after a msg
                                // if later we implement other way then review this
                                message: conv.messages[0],
                                ai_is_replying: conv.ai_is_replying,
                                closed_by: conv.closed_by,
                                caller: "getClientConversations",
                            },
                            { root: true }
                        );
                    });
                    resolve(res);
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
