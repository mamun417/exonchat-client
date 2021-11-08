// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OfflineChatReqStateInterface {
    offlineChatRequests: any;
    notSolvedOfflineChatReqCount: any;
    paginationMeta: any;
    pipeline: any;
}

function state(): OfflineChatReqStateInterface {
    return {
        offlineChatRequests: {},
        notSolvedOfflineChatReqCount: 0,
        paginationMeta: {
            current_page: 1,
            total_page: 1,
            total: 0,
        },
        pipeline: {
            s: "",
            status: "open",
        },
    };
}

export default state;
