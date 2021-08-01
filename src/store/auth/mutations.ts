import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
    someMutation(/* state: ChatStateInterface */) {
        // your code
    },

    authSuccess(state, userInfo) {
        if (userInfo.bearerToken) {
            localStorage.setItem('exonchat_token', userInfo.bearerToken);
            state.token = userInfo.bearerToken;
        }

        if (state.user?.user_meta && state.user?.user_meta.attachment?.src) {
            userInfo.data.user_meta.attachment.src = state.user.user_meta.attachment.src;
        }

        localStorage.setItem('user', JSON.stringify(userInfo.data));
        state.user = userInfo.data;
    },

    authCreate() {
        // nothing
    },

    logOut(state) {
        // you cant clear all. cz for now client chat also managed from same location
        localStorage.clear();
        sessionStorage.clear();
        state.token = '';
        state.user = {};
    },

    updateToken(state, token) {
        // console.log(token);

        localStorage.setItem('exonchat_token', token);
        state.token = token;
    },

    updateUser(state, user) {
        localStorage.setItem('user', JSON.stringify(user));
        state.user = user;
    },

    updateUserProfileAvatar(state, imgSrc) {
        state.user.user_meta.attachment.src = imgSrc;
    },
};

export default mutation;
