// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OfflineChatReqStateInterface {
    offlineChatRequests: any;
    statusWiseCount: any;
    paginationMeta: any;
    pipeline: any;
}

function state(): OfflineChatReqStateInterface {
    return {
        offlineChatRequests: {},
        statusWiseCount: {},
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
