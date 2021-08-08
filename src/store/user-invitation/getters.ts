import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { UserInvitationStateInterface } from "./state";

const getters: GetterTree<UserInvitationStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },
};

export default getters;
