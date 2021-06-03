import { ActionTree } from 'vuex';
import { StateInterface } from 'src/store';
import { SettingProfileInterface } from './state';

const actions: ActionTree<SettingProfileInterface, StateInterface> = {
    updateProfile(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('profile/update', payload.inputs)
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
