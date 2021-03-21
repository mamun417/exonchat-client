export interface ChatStateInterface {
    joinConvInfo: any;
    convInfo: any;
    chatPanels: Array<string>; // holds opened chat panels
    selectedPanel: null | string;
    messages: Array<string>;
}

function state(): ChatStateInterface {
    const joinConvInfo = localStorage.getItem('joinConvInfo');
    const convInfo = localStorage.getItem('convInfo');

    return {
        joinConvInfo: joinConvInfo ? JSON.parse(joinConvInfo) : {},
        convInfo: convInfo ? JSON.parse(convInfo) : {},
        chatPanels: [],
        selectedPanel: null,
        messages: [],
    };
}

export default state;
