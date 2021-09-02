// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TicketStateInterface {
    tickets: any;
}

function state(): TicketStateInterface {
    return {
        tickets: {},
    };
}

export default state;
