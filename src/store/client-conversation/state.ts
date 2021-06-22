// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClientConversationStateInterface {
    clientConversations: any;
    paginationMeta: any;
    pipeline: any;
    newIds: any;
}

function state(): ClientConversationStateInterface {
    return {
        clientConversations: {},
        paginationMeta: {
            current_page: 1,
            total_page: 1,
            total: 0,
        },
        pipeline: {},
        newIds: [],
    };
}

export default state;
