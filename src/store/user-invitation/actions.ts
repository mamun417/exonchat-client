import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserInvitationStateInterface } from './state';

const actions: ActionTree<UserInvitationStateInterface, StateInterface> = {
    getInvitations() {
        return new Promise((resolve, reject) => {
            window.api
                .get('users/invitations')
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    sendInvitation(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('users/invitations/invite', payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    deleteInvitation(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .delete(`users/invitations/${payload.id}`)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    convertType(context, payload) {
        console.log(payload.inputs);
        return new Promise((resolve, reject) => {
            window.api
                .post(`users/invitations/${payload.inputs.id}/update`, payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // changeDepartmentActiveStatus(context, payload) {
    //     return new Promise((resolve, reject) => {
    //         window.api
    //             .post(`invitations/:id/update`, {
    //                 active: payload.active,
    //             })
    //             .then((res: any) => {
    //                 resolve(res);
    //             })
    //             .catch((err: any) => {
    //                 reject(err);
    //             });
    //     });
    // },
};

export default actions;
