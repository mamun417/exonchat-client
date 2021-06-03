import { GetterTree } from 'vuex';
import { StateInterface } from 'src/store';
import { SettingUiStateInterface } from './state';

const getters: GetterTree<SettingUiStateInterface, StateInterface> = {
    globalColor(state) {
        return state.globalColor;
    },
    globalBgColor(state) {
        return `bg-${state.globalColor}`;
    },
    globalTextColor(state) {
        return `text-${state.globalColor}`;
    },
    globalColorToHex() {
        return 'upcoming';
    },

    rightBarState(state) {
        return state.rightDrawerState;
    },
};

export default getters;
