// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VisitorsStateInterface {
    visitors: any;
}

function state(): VisitorsStateInterface {
    return {
        visitors: {},
    };
}

export default state;
