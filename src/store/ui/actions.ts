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

    getAvaterPath(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .get(`profile/attachments/${payload.id}`, {
                    responseType: 'arraybuffer',
                })
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    updateAvater(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('profile/update/avater', payload)
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
