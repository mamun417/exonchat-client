export interface ChatStateInterface {
    convInfo: any;
    chatPanels: Array<string>; // holds opened chat panels
    selectedPanel: null | string;
    messages: Array<string>;
}

function state(): ChatStateInterface {
    const convInfo = localStorage.getItem('convInfo');

    return {
        convInfo: convInfo ? JSON.parse(convInfo) : {},
        chatPanels: [],
        selectedPanel: null,
        messages: [],
    };
}

export default state;
