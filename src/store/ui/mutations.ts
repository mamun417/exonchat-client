import { MutationTree } from 'vuex';
import { UiStateInterface } from './state';

const mutation: MutationTree<UiStateInterface> = {
    someMutation(/* state: AuthStateInterface */) {
        // your code
    },

    updateGlobalColor(state, color) {
        localStorage.setItem('globalColor', color);
        state.globalColor = color;
    },
};

export default mutation;
