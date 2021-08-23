import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { AuthStateInterface } from "./state";

const getters: GetterTree<AuthStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },

    token(state) {
        return state.token;
    },

    isLoggedIn(state) {
        return !!state.token;
    },

    profile(state) {
        return state.user;
    },

    isAdmin(state) {
        return state.user?.role?.slug === "admin";
    },
};

export default getters;
