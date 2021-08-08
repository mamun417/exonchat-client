export interface SettingUiStateInterface {
    globalColor: string;
    rightDrawerState: any;
}

function state(): SettingUiStateInterface {
    const rightDrawerState = localStorage.getItem("right_drawer_state");
    return {
        globalColor: localStorage.getItem("globalColor") || "blue-grey",
        rightDrawerState: rightDrawerState ? JSON.parse(rightDrawerState) : { visible: false },
    };
}

export default state;
