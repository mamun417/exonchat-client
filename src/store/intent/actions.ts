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

    saveIntent(context, payload) {
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
};

export default actions;
