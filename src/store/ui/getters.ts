import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { UiStateInterface } from './state';

const getters: GetterTree<UiStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },

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

    conversationTrucking(state) {
        return state.truckingConversation;
    },
};

export default getters;
