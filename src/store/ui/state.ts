export interface UiStateInterface {
    globalColor: string;
    trackingConversation: any;
    rightDrawerState: any;
}

function state(): UiStateInterface {
    const rightDrawerState = localStorage.getItem('right_drawer_state');
    return {
        globalColor: localStorage.getItem('globalColor') || 'green',
        trackingConversation: {
            conversationId: '',
        },
        rightDrawerState: rightDrawerState ? JSON.parse(rightDrawerState) : { visible: false },
    };
}

export default state;
