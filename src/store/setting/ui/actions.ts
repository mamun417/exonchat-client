import { ActionTree } from "vuex";
import { StateInterface } from "src/store";
import { SettingUiStateInterface } from "./state";

const actions: ActionTree<SettingUiStateInterface, StateInterface> = {
    getUiSetting(context) {
        return new Promise((resolve, reject) => {
            window.api
                .get("settings/ui")
                .then((res: any) => {
                    // update ui setting
                    res.data.forEach((uiSetting: any) => {
                        const value = uiSetting.user_settings_value.length
                            ? uiSetting.user_settings_value[0].value
                            : uiSetting.default_value;

                        const grantedValue = uiSetting.input_type === "checkbox" ? value === "true" : value;

                        if (uiSetting.slug === "global_color") {
                            context.commit("updateGlobalColor", grantedValue);
                        }
                    });

                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },
    updateUiSetting(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post("settings/ui", payload.inputs)
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
