import { MutationTree } from "vuex";
import { SettingUiStateInterface } from "./state";

const mutation: MutationTree<SettingUiStateInterface> = {
    updateGlobalColor(state, color) {
        localStorage.setItem("globalColor", color);
        state.globalColor = color;
    },

    updateRightDrawerState(state, payload) {
        // console.log(payload);

        const info: any = {
            visible: payload.hasOwnProperty("visible") ? payload.visible : state.rightDrawerState.visible,
            mode: payload.mode || state.rightDrawerState.mode,
        };

        if (payload.mode === "conversation") {
            info.conv_id = payload.conv_id;
        }

        state.rightDrawerState = info;

        localStorage.setItem("right_drawer_state", JSON.stringify(info));
    },

    toggleRightDrawer(state) {
        state.rightDrawerState.visible = !state.rightDrawerState.visible;

        localStorage.setItem("right_drawer_state", JSON.stringify(state.rightDrawerState));
    },
};

export default mutation;
