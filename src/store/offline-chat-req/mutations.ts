import { MutationTree } from "vuex";
import { OfflineChatReqStateInterface } from "./state";
import helpers from "boot/helpers/helpers";

const mutation: MutationTree<OfflineChatReqStateInterface> = {
    // updateOfflineChatReq(state: OfflineChatReqStateInterface, offlineChatReqData: any) {
    //     const offlineChatReqId = offlineChatReqData.offline_chat_req_id;
    //
    //     if (offlineChatReqId) {
    //         let offlineChatReq: any = state.offlineChatRequests[offlineChatReqId];
    //
    //         if (!offlineChatReq?.id) {
    //             if (!offlineChatReqData.offline_chat_req) {
    //                 offlineChatReqData.offline_chat_req = {};
    //             }
    //
    //             offlineChatReq = {
    //                 ...offlineChatReqData.offline_chat_req,
    //                 replies: {},
    //             };
    //         }
    //
    //         if (offlineChatReqData.hasOwnProperty("replies") && offlineChatReqData.replies.length) {
    //             offlineChatReqData.replies.forEach((reply: any) => {
    //                 if (!offlineChatReq.replies.hasOwnProperty(reply.id)) {
    //                     offlineChatReq.replies[reply.id] = reply;
    //                 }
    //             });
    //         }
    //     }
    // },

    updatePaginationMeta(state, data: any) {
        state.paginationMeta = data;
    },

    updateCurrentPage(state, currentPage) {
        state.paginationMeta.current_page = currentPage;
    },

    updatePipeline(state, payload) {
        state.pipeline = helpers.updatePipeline(state.pipeline, payload.pipeline);
    },
};

export default mutation;
