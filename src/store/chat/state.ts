export interface ChatStateInterface {
    convInfo: any;
    convStateInfo: any;
    chatPanels: Array<string>; // holds opened chat panels
    selectedPanel: null | string;
    messages: any;
    chatRequest: any;
}

function state(): ChatStateInterface {
    const convStateInfo = localStorage.getItem('convStateInfo');
    const convInfo = localStorage.getItem('convInfo');

    return {
        convInfo: convInfo ? JSON.parse(convInfo) : {},
        convStateInfo: convStateInfo ? JSON.parse(convStateInfo) : {},
        chatPanels: [],
        selectedPanel: null,
        messages: {},
        chatRequest: {},
    };
}

export default state;
