export interface UiStateInterface {
    globalColor: string;
}

function state(): UiStateInterface {
    return {
        globalColor: localStorage.getItem('globalColor') || 'green',
    };
}

export default state;
