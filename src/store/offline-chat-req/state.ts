// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OfflineChatReqStateInterface {
    offlineChatRequests: any;
    paginationMeta: any;
    pipeline: any;
}

function state(): OfflineChatReqStateInterface {
    return {
        offlineChatRequests: {},
        paginationMeta: {
            current_page: 1,
            total_page: 1,
            total: 0,
        },
        pipeline: {
            s: "",
        },
    };
}

export default state;
