import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
        $api: AxiosInstance;
    }
}
declare global {
    interface Window {
        api: any;
    }
}

const api = function (store: any, router: any) {
    // axios.defaults.baseURL = process.env.PROD ? process.env.PROD_API_ENDPOINT : process.env.API_ENDPOINT

    // Set config defaults when creating the instance
    const insAxios = axios.create({
        baseURL: 'http://127.0.0.1:3000',
        withCredentials: true,
    });

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
            return Promise.reject(err);
        }
    );

    // // handle before res is send to client
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
                        return axios(err.config);
                    });
                } else {
                    return new Promise((resolve) => {
                        const interval = setInterval(() => {
                            if (!tokenRefreshing) {
                                clearInterval(interval);
                                resolve(axios(err.config));
                            }
                        }, 300);
                    });
                }
            } else if (
                err.response.status === 422 &&
                ['Bearer token invalid', 'Refresh token not found'].includes(err.response.data.message)
            ) {
                store.dispatch('auth/logout').then(() => {
                    tokenRefreshing = false;
                    return router.push('login');
                });
            } else {
                tokenRefreshing = false;
                return Promise.reject(err);
            }
        }
    );

    return insAxios;
};

export default boot(({ app, router, store }) => {
    // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axios = axios;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$api = api(store, router);
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API

    window.api = api(store, router);
});

export { axios, api };
