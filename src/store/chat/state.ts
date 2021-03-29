export interface ChatStateInterface {
    convStateInfo: any;
    chatPanels: Array<string>; // holds opened chat panels
    selectedPanel: null | string;
    messages: Array<string>;
    chatRequest: any;
}

function state(): ChatStateInterface {
    const convStateInfo = localStorage.getItem('convStateInfo');

    return {
        convStateInfo: convStateInfo ? JSON.parse(convStateInfo) : {},
        chatPanels: [],
        selectedPanel: null,
        messages: [],
        chatRequest: {},
    };
}

export default state;
