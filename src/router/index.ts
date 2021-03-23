import { route } from 'quasar/wrappers';
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { StateInterface } from '../store';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route<StateInterface>(function ({ store }) {
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : process.env.VUE_ROUTER_MODE === 'history'
        ? createWebHistory
        : createWebHashHistory;

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,

        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
    });

    Router.beforeEach((to, from, next) => {
        if (to.path !== '/' && to.path.slice(-1) === '/') {
            return next(to.path.substring(0, to.path.length - 1));
        }

        const login = store.getters['auth/isLoggedIn'];

        if (to.matched.some((record) => record.meta.requiresAuth)) {
            if (login) {
                return next();
            }

            return next({ name: 'login' });
        } else if (to.matched.some((record) => !record.meta.requiresAuth) && login) {
            // if authenticated and logged-in
            return next({ name: 'home' });
        }

        next(); // make sure to always call next()!
    });

    return Router;
});
