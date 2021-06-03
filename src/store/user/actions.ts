import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserStateInterface } from './state';

const actions: ActionTree<UserStateInterface, StateInterface> = {
    getUsers() {
        return new Promise((resolve, reject) => {
            window.api
                .get('users')
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    convertType(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post(`users/${payload.inputs.id}/active-status`, payload.inputs)
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
