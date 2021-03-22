export interface ChatStateInterface {
    convStateInfo: any;
    convInfo: any;
    chatPanels: Array<string>; // holds opened chat panels
    selectedPanel: null | string;
    messages: Array<string>;
}

function state(): ChatStateInterface {
    const convStateInfo = localStorage.getItem('convStateInfo');
    const convInfo = localStorage.getItem('convInfo');

    return {
        convStateInfo: convStateInfo ? JSON.parse(convStateInfo) : {},
        convInfo: convInfo ? JSON.parse(convInfo) : {},
        chatPanels: [],
        selectedPanel: null,
        messages: [],
    };
}

export default state;
