import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { DepartmentStateInterface } from './state';

const actions: ActionTree<DepartmentStateInterface, StateInterface> = {
    getDepartments() {
        return new Promise((resolve, reject) => {
            window.api
                .get('departments')
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    createDepartment(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('departments', payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    updateDepartment(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post(`departments/${payload.inputs.id}`, payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    deleteDepartment(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .delete(`departments/${payload.id}`)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    changeDepartmentActiveStatus(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post(`departments/${payload.id}/active-status`, {
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
