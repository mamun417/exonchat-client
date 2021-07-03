// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChatHistoryStateInterface {
    paginationMeta: any;
    pipeline: any;
    newLoadedChatHistoriesIds: any;
}

function state(): ChatHistoryStateInterface {
    return {
        paginationMeta: {
            current_page: 1,
            total_page: 1,
            total: 0,
        },
        pipeline: {
            s: '',
        },
        newLoadedChatHistoriesIds: [],
    };
}

export default state;
