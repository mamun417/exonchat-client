import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChatTemplateStateInterface } from './state';

const actions: ActionTree<ChatTemplateStateInterface, StateInterface> = {
    getChatTemplates(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .get('chat-templates', {
                    params: {
                        tag: payload?.keyword,
                    },
                })
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    createChatTemplate(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('chat-templates', payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    updateChatTemplate(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post(`chat-templates/${payload.inputs.id}`, payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    deleteChatTemplate(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .delete(`chat-templates/${payload.id}`)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    changeChatTemplateActiveStatus(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post(`chat-templates/${payload.id}/active-status`, {
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
