import { GetterTree } from "vuex";
import { StateInterface } from "src/store";
import { SettingProfileInterface } from "./state";

const getters: GetterTree<SettingProfileInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },
};

export default getters;
