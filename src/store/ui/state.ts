export interface UiStateInterface {
    prop: boolean;
}

function state(): UiStateInterface {
    return {
        prop: false,
    };
}

export default state;
