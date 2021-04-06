export interface ChatStateInterface {
    clientInitiateConvInfo: any;
    convStateInfo: any;
    chatPanels: Array<string>; // holds opened chat panels
    selectedPanel: null | string;
    messages: any;
    chatRequests: any;
    chatAgents: any;
    onlineChatAgents: any;
}

function state(): ChatStateInterface {
    const convStateInfo = localStorage.getItem('convStateInfo');
    const clientInitiateConvInfo = localStorage.getItem('clientInitiateConvInfo');

    return {
        clientInitiateConvInfo: clientInitiateConvInfo ? JSON.parse(clientInitiateConvInfo) : {},
        convStateInfo: convStateInfo ? JSON.parse(convStateInfo) : {},
        chatPanels: [],
        selectedPanel: null,
        messages: {},
        chatRequests: {},
        chatAgents: {},
        onlineChatAgents: {},
    };
}

export default state;
