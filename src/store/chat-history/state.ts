// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChatHistoryStateInterface {
    chatHistories: any;
    paginationMeta: any;
    pipeline: any;
}

function state(): ChatHistoryStateInterface {
    return {
        chatHistories: [],
        paginationMeta: {
            current_page: 1,
            total_page: 1,
            total: 0,
        },
        pipeline: {
            s: "",
            chat_department_id: "",
            agent_id: "",
            rating: "",
        },
    };
}

export default state;
