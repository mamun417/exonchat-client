import { MutationTree } from "vuex";
import { TicketStateInterface } from "./state";

const mutation: MutationTree<TicketStateInterface> = {
    storeTickets(state: TicketStateInterface, tickets: any) {
        state.tickets = [];
        state.tickets = tickets;
    },
};

export default mutation;
