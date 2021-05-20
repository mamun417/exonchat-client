// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClientConversationStateInterface {
    clientConversations: any;
}

function state(): ClientConversationStateInterface {
    return {
        clientConversations: {},
    };
}

export default state;
