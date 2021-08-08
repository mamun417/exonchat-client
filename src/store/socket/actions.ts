import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { SocketStateInterface } from "./state";

const actions: ActionTree<SocketStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },
};

export default actions;
