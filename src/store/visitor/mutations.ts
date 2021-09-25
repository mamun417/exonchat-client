import { MutationTree } from "vuex";
import { VisitorsStateInterface } from "./state";

const mutation: MutationTree<VisitorsStateInterface> = {
    updateVisitor(state: VisitorsStateInterface, visitorInfo: any) {
        // we are replacing full array with new array
        state.visitors = visitorInfo.clients_visit_data;
    },
};

export default mutation;
