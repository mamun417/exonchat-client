import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { OfflineChatReqStateInterface } from "./state";
import OfflineChatRequest from "src/store/models/offline-chat-req/OfflineChatRequest";

const actions: ActionTree<OfflineChatReqStateInterface, StateInterface> = {
    getChatRequests(context) {
        return new Promise((resolve, reject) => {
            const keyword = context.state.pipeline.s || "";

            window.api
                .get("offline-chat-requests", {
                    params: {
                        p: context.state.paginationMeta.current_page,
                        s: keyword,
                        status: context.state.pipeline.status,
                    },
                })
                .then(async (res: any) => {
                    await OfflineChatRequest.deleteAll();
                    await OfflineChatRequest.insert({ data: res.data.chat_requests.data });

                    context.commit("updatePaginationMeta", res.data.chat_requests.pagination);

                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    async getReplies(context, payload: any) {
        try {
            const res = await window.api.get(`offline-chat-requests/${payload.offline_chat_req_id}/replies`);

            const offlineChatReq = res.data;
            await OfflineChatRequest.insert({ data: offlineChatReq });

            return Promise.resolve(res);
        } catch (e: any) {
            return Promise.reject(e);
        }
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

    getNotSolvedOfflineChatReqCount(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get("offline-chat-requests/not-solved-count")
                .then((res: any) => {
                    context.commit("updateNotSolvedOfflineChatReqCount", res);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },
};

export default actions;
