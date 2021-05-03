import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { IntentStateInterface } from './state';

const actions: ActionTree<IntentStateInterface, StateInterface> = {
    getIntents() {
        return new Promise((resolve, reject) => {
            window.api
                .get('intents')
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    createIntent(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('intents', payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    updateIntent(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post(`intents/${payload.inputs.id}`, payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    deleteIntent(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .delete(`intents/${payload.id}`)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    changeIntentActiveStatus(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post(`intents/${payload.id}/active-status`, {
                    active: payload.active,
                })
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
