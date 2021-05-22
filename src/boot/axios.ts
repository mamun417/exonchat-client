import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
        $api: AxiosInstance;
    }
}

declare global {
    interface Window {
        api: any;
        socketSessionApi: any;
        router: any;
    }
}

const api = function (store: any, router: any) {
    // Set config defaults when creating the instance
    const insAxios = axios.create({
        baseURL: 'http://127.0.0.1:3000',
        withCredentials: true,
    });

    // insAxios.defaults.baseURL = process.env.PROD ? process.env.PROD_API_ENDPOINT : process.env.API_ENDPOINT

    let tokenRefreshing = false;

    // handle before req happen
    insAxios.interceptors.request.use(
        (req) => {
            const token = localStorage.getItem('token');

            if (token) {
                req.headers['Authorization'] = 'Bearer ' + token;
            }

            return req;
        },
        (err) => {
            return Promise.reject(err).then((r) => r);
        }
    );

    // handle before res is send to client
    insAxios.interceptors.response.use(
        (res) => {
            return res;
        },
        (err) => {
            const errorCode = err.response.status;

            if (errorCode === 401) {
                if (!tokenRefreshing) {
                    tokenRefreshing = true;

                    return store.dispatch('auth/refreshToken').then(() => {
                        tokenRefreshing = false;
                        return insAxios(err.config);
                    });
                } else {
                    return new Promise((resolve) => {
                        const interval = setInterval(() => {
                            if (!tokenRefreshing) {
                                clearInterval(interval);
                                resolve(insAxios(err.config));
                            }
                        }, 300);
                    });
                }
            } else if (
                err.response.status === 422 &&
                ['Invalid bearer token', 'Refresh token not found'].includes(err.response.data.message)
            ) {
                store.dispatch('auth/logOut').then(() => {
                    tokenRefreshing = false;
                    return router.push({ name: 'login' });
                });
            } else {
                tokenRefreshing = false;

                // make errors response object from array
                if (_.isArray(err.response.data.message)) {
                    const msgObj: any = {};

                    err.response.data.message.forEach((singleMsg: string) => {
                        const msgKey = singleMsg.split(' ')[0];

                        msgObj[msgKey] = singleMsg;
                    });

                    err.response.data.message = msgObj;
                }

                return Promise.reject(err);
            }
        }
    );

    return insAxios;
};

// socketUserApi
// socketClientApi
export const socketSessionApi = function (router: any) {
    const insAxios = axios.create({
        baseURL: 'http://127.0.0.1:3000',
        withCredentials: true,
    });

    // insAxios.defaults.baseURL = process.env.PROD ? process.env.PROD_API_ENDPOINT : process.env.API_ENDPOINT

    insAxios.interceptors.request.use(
        (req) => {
            // ec_client_socket_token is from local cz now we are supporting cient can resume after restarting browser
            const token =
                router.currentRoute._value.path === '/web-chat'
                    ? localStorage.getItem('ec_client_socket_token')
                    : sessionStorage.getItem('ec_user_socket_token');

            if (token) {
                req.headers['Authorization'] = 'Bearer ' + token;
            }

            return req;
        },
        (err) => {
            return Promise.reject(err).then((r) => r);
        }
    );

    insAxios.interceptors.response.use(
        (res) => {
            return res;
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    return insAxios;
};

// export const userSocketApi = function () {
//     return clientSocketApi('ec_user_socket_token');
// };

export default boot(({ app, router, store }) => {
    window.router = router;
    // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axios = axios;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$api = api(store, router);
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API
    window.api = api(store, router);

    // app.config.globalProperties.$clientSocketApi = clientSocketApi();
    // this will allow you to use this.$clientSocketApi (for client api with socket token
    // window.clientSocketApi = clientSocketApi();

    app.config.globalProperties.$socketSessionApi = socketSessionApi(router);
    // this will allow you to use this.$socketSessionApi (for socket apis)
    window.socketSessionApi = socketSessionApi(router);
});

export { axios, api };
