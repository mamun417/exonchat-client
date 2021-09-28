import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { VisitorsStateInterface } from "./state";

const getters: GetterTree<VisitorsStateInterface, StateInterface> = {
    visitors(state) {
        return Object.values(state.visitors);
    },

    visits: (state) => (sesId: any) => {
        return state.visitors?.length
            ? state.visitors?.find((visitor: any) => visitor.session_id === sesId).visits
            : [];
    },
};

export default getters;
