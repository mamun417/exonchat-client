import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { TicketStateInterface } from "./state";

const getters: GetterTree<TicketStateInterface, StateInterface> = {
    tickets(state) {
        return state.tickets;
    },
};

export default getters;
