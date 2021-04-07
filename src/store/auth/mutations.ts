import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
    someMutation(/* state: ChatStateInterface */) {
        // your code
    },

    authSuccess(state, userInfo) {
        localStorage.setItem('token', userInfo.bearerToken);
        state.token = userInfo.bearerToken;

        localStorage.setItem('user', JSON.stringify(userInfo.data));
        state.user = userInfo.data;
    },

    logOut(state) {
        localStorage.clear();
        sessionStorage.clear();
        state.token = '';
        state.user = {};
    },

    updateToken(state, token) {
        console.log(token);

        localStorage.setItem('token', token);
        state.token = token;
    },
};

export default mutation;
