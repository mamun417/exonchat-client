import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { OfflineChatReqStateInterface } from "./state";
import * as _l from "lodash";
import OfflineChatRequest from "src/store/models/offline-chat-req/OfflineChatRequest";

const actions: ActionTree<OfflineChatReqStateInterface, StateInterface> = {
    getChatRequests(context) {
        return new Promise((resolve, reject) => {
            const keyword = context.state.pipeline.s || "";

            window.api
                .get("offline-chat-requests", {
                    params: {
                        p: context.state.paginationMeta.current_page,
                        name: keyword,
                        // email: query,
                        // subject: query,
                        // message: query,
                    },
                })
                .then(async (res: any) => {
                    await OfflineChatRequest.insert({ data: res.data.chat_requests.data });

                    context.commit("updatePaginationMeta", res.data.chat_requests.pagination);

                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    getReplies(context, payload: any) {
        return new Promise((resolve, reject) => {
            window.api
                .get(`offline-chat-requests/${payload.offline_chat_req_id}/replies`)
                .then(async (res: any) => {
                    const offlineChatReq = res.data;

                    await OfflineChatRequest.insert({ data: offlineChatReq });

                    // context.commit("updateOfflineChatReq", {
                    //     offline_chat_req_id: offlineChatReq.id,
                    //     offline_chat_req: _l.pick(offlineChatReq, ["id", "created_by_id", "created_at"]),
                    //     replies: offlineChatReq.offline_chat_req_replies,
                    // });

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
