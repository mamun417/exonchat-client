import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { DepartmentStateInterface } from "./state";

const getters: GetterTree<DepartmentStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },
};

export default getters;
