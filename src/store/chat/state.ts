export interface ChatStateInterface {
    clientInitiateConvInfo: any;
    convStateInfo: any;
    chatPanels: Array<string>; // holds opened chat panels
    selectedPanel: null | string;
    conversationInfo: any;
    chatRequests: any;
    chatUsers: any;
    conversations: any;
}

function state(): ChatStateInterface {
    const convStateInfo = localStorage.getItem('convStateInfo');
    const clientInitiateConvInfo = localStorage.getItem('clientInitiateConvInfo');
    const conversations = localStorage.getItem('ec_conversations');

    return {
        clientInitiateConvInfo: clientInitiateConvInfo ? JSON.parse(clientInitiateConvInfo) : {},
        convStateInfo: convStateInfo ? JSON.parse(convStateInfo) : {},
        chatPanels: [],
        selectedPanel: null,
        conversationInfo: {},
        chatRequests: {},
        chatUsers: {},
        conversations: conversations ? JSON.parse(conversations) : {},
    };
}

export default state;
