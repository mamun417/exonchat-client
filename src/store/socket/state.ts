export interface SocketStateInterface {
    agentSesId: null | undefined | string;
    apiKey: null | undefined | string;
}

function state(): SocketStateInterface {
    return {
        agentSesId: sessionStorage.getItem("exonchat-ses-id"),
        apiKey: localStorage.getItem("agent-api-key"),
    };
}

export default state;
