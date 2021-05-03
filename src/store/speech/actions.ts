import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { SpeechStateInterface } from './state';

const actions: ActionTree<SpeechStateInterface, StateInterface> = {
    getSpeeches() {
        return new Promise((resolve, reject) => {
            window.api
                .get('speeches')
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    createSpeech(context, payload) {
        console.log(payload);
        return new Promise((resolve, reject) => {
            window.api
                .post('speeches', payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    // updateIntent(context, payload) {
    //     return new Promise((resolve, reject) => {
    //         window.api
    //             .post(`intents/${payload.inputs.id}`, payload.inputs)
    //             .then((res: any) => {
    //                 resolve(res);
    //             })
    //             .catch((err: any) => {
    //                 reject(err);
    //             });
    //     });
    // },
    //
    // deleteIntent(context, payload) {
    //     return new Promise((resolve, reject) => {
    //         window.api
    //             .delete(`intents/${payload.id}`)
    //             .then((res: any) => {
    //                 resolve(res);
    //             })
    //             .catch((err: any) => {
    //                 reject(err);
    //             });
    //     });
    // },
    //
    // changeIntentActiveStatus(context, payload) {
    //     return new Promise((resolve, reject) => {
    //         window.api
    //             .post(`intents/${payload.id}/active-status`, {
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
