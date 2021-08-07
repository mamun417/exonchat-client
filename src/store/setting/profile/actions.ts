import { ActionTree } from 'vuex';
import { StateInterface } from 'src/store';
import { SettingProfileInterface } from './state';

const actions: ActionTree<SettingProfileInterface, StateInterface> = {
    reloadProfileImage(context, user) {
        return new Promise((resolve, reject) => {
            if (user.user_meta.attachment) {
                window.api
                    .get(`attachments/${user.user_meta.attachment.id}`, {
                        responseType: 'arraybuffer',
                    })
                    .then((imgRes: any) => {
                        const imgSrc: any = URL.createObjectURL(
                            new Blob([imgRes.data], { type: imgRes.headers['content-type'] })
                        );

                        context.commit('auth/updateUserProfileAvatar', imgSrc, { root: true });
                        resolve(true);
                    })
                    .catch((e: any) => {
                        console.log(e);

                        reject(false);
                    });
            } else {
                resolve(true);
            }
        });
    },

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

    updateOnlineStatus(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('profile/update-online-status', payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    getAvatarPath(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .get(`attachments/${payload.id}`, {
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

    updateAvatar(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post('attachments', payload)
                .then((res: any) => {
                    console.log(res.data);

                    window.api
                        .post('profile/update/avatar', { attachment_id: res.data.data[0].attachment_info.id })
                        .then((res: any) => {
                            context.commit('auth/updateUser', res.data, { root: true });
                            resolve(res);
                        })
                        .catch((err: any) => {
                            reject(err);
                        });
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },
};

export default actions;
