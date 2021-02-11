export interface SocketStateInterface {
    prop: boolean;
}

function state(): SocketStateInterface {
    return {
        prop: false,
    };
}

export default state;
