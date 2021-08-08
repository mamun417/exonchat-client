import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { OfflineChatReqStateInterface } from "./state";

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
                .then((res: any) => {
                    context.commit("updatePaginationMeta", res.data.chat_requests.pagination);

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
