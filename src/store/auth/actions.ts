import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
        //test
    },

    register(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('subscribers', payload.inputs)
                .then((res: any) => {
                    const subscriberInfo = res.data;

                    context.commit('authCreate', subscriberInfo);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    login(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('auth/login', payload.inputs)
                .then((res: any) => {
                    const userInfo = res.data;

                    context.commit('authSuccess', userInfo);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    logOut(context) {
        return new Promise((resolve) => {
            context.commit('logOut');
            resolve(true);
        });
    },

    refreshToken(context) {
        return new Promise((resolve, reject) => {
            window.api
                .post('auth/refresh')
                .then((res: any) => {
                    context.commit('updateToken', res.data.bearerToken);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    updateAuthInfo(context) {
        return new Promise((resolve, reject) => {
            const userId = context.state.user.id;

            window.api
                .get(`users/${userId}`)
                .then((res: any) => {
                    context.commit('authSuccess', res);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    sendPasswordResetEmail(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('password/email', payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    resetPassword(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('password/reset', payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    changePassword(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('password/change', payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },
};

export default actions;
