export interface ChatStateInterface {
    chatPanels: Array<string>; // holds opened chat panels
    selectedPanel: null | string;
    messages: Array<string>;
}

function state(): ChatStateInterface {
    return {
        chatPanels: [],
        selectedPanel: null,
        messages: []
    };
}

export default state;
