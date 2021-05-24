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
};

export default actions;

// export function
// export function refreshToken(context, payload) {
//     return new Promise((resolve, reject) => {
//         axios
//             .post('auth/refresh')
//             .then((res) => {
//                 context.commit('updateToken', res.data.access_token);
//                 resolve(res);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });
// }

// export function sendPasswordResetEmail(context, payload) {
//     return new Promise((resolve, reject) => {
//         axios
//             .post('password/email', payload.inputs)
//             .then((res) => {
//                 resolve(res);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });
// }

// export function resetPassword(context, payload) {
//     return new Promise((resolve, reject) => {
//         axios
//             .patch('password/reset', payload.inputs)
//             .then((res) => {
//                 resolve(res);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });
// }

// export function updateToken(context, token) {
//     context.commit('updateToken', token);
// }
