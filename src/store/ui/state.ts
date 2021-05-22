export interface UiStateInterface {
    globalColor: string;
    trackingConversation: any;
}

function state(): UiStateInterface {
    return {
        globalColor: localStorage.getItem('globalColor') || 'green',
        trackingConversation: {
            conversationId: '',
        },
    };
}

export default state;
