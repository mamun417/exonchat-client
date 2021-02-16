export interface ChatStateInterface {
    chatPanels: Array<string>; // holds opened chat panels
    selectedPanel: null | string;
}

function state(): ChatStateInterface {
    return {
        chatPanels: [],
        selectedPanel: null,
    };
}

export default state;
