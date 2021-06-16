export interface ChatStateInterface {
    clientInitiateConvInfo: any;
    convStateInfo: any;
    chatPanels: Array<string>; // holds opened chat panels
    selectedPanel: null | string;
    conversationInfo: any;
    chatRequests: any;
    chatUsers: any;
    conversations: any;
    typingStates: any;
}

function state(): ChatStateInterface {
    const convStateInfo = localStorage.getItem('convStateInfo');
    const clientInitiateConvInfo = localStorage.getItem('clientInitiateConvInfo');
    const clientInitiateConvInfoObj = clientInitiateConvInfo
        ? { ...JSON.parse(clientInitiateConvInfo), showRatingForm: !!localStorage.getItem('showRatingForm') }
        : {};
    const conversations = localStorage.getItem('ec_conversations');

    return {
        clientInitiateConvInfo: clientInitiateConvInfoObj,
        convStateInfo: convStateInfo ? JSON.parse(convStateInfo) : {},
        chatPanels: [],
        selectedPanel: null,
        conversationInfo: {},
        chatRequests: {},
        chatUsers: {},
        conversations: conversations ? JSON.parse(conversations) : {},
        typingStates: {},
    };
}

export default state;
