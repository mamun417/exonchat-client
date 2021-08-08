import { ActionTree } from "vuex";
import { StateInterface } from "src/store";
import { SettingChatInterface } from "./state";

const actions: ActionTree<SettingChatInterface, StateInterface> = {
    getChatSetting() {
        return new Promise((resolve, reject) => {
            window.api
                .get("settings/chat")
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    updateChatSetting(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post("settings/chat", payload.inputs)
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
