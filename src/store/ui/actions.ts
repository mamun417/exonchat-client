import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UiStateInterface } from './state';

const actions: ActionTree<UiStateInterface, StateInterface> = {
    getAppSetting() {
        return new Promise((resolve, reject) => {
            window.api
                .get('settings/app')
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    updateAppSetting(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('settings/app', payload.inputs)
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
