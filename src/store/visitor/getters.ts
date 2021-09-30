import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { VisitorsStateInterface } from "./state";
import * as _l from "lodash";

const getters: GetterTree<VisitorsStateInterface, StateInterface> = {
    visitors(state) {
        const visitors = state.visitors;

        return _l
            .sortBy(visitors, [
                (visitor: any) => {
                    const last: any = _l.last(visitor.visits);

                    return last.visiting;
                },
            ])
            .reverse();
    },

    visits: (state) => (sesId: any) => {
        return state.visitors?.length
            ? state.visitors?.find((visitor: any) => visitor?.session_id === sesId)?.visits
            : [];
    },
};

export default getters;
