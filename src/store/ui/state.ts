export interface UiStateInterface {
    globalColor: string;
    truckingConversation: any;
}

function state(): UiStateInterface {
    return {
        globalColor: localStorage.getItem('globalColor') || 'green',
        truckingConversation: {},
    };
}

export default state;
