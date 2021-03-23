export function authSuccess(state, userInfo) {
    localStorage.setItem('token', userInfo.access_token);
    state.token = userInfo.access_token;

    //localStorage.setItem('user', JSON.stringify(userInfo.user));
    //state.user = userInfo.user;
}
import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
    someMutation(/* state: ChatStateInterface */) {
        // your code
    },

    updateToken(state, token) {
        localStorage.setItem('token', token);
        state.token = token;
    },

    authOut(state) {
        localStorage.clear();
        state.token = '';
        //state.user = {};
    },
};

export default mutation;
