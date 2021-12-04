import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { TicketStateInterface } from "./state";

const actions: ActionTree<TicketStateInterface, StateInterface> = {
    getTickets(context, payload) {
        return new Promise((resolve, reject) => {
            context.commit("storeTickets", []);

            window.api
                .get(`apps/whmcs/tickets?email=${payload.email}`)
                .then((res: any) => {
                    context.commit("storeTickets", res.data);
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },

    storeTicket(context, payload) {
        return new Promise((resolve, reject) => {
            window.api
                .post(`/apps/whmcs/tickets/open/${payload.conv_id}`, payload.inputs)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    },
};

export default actions;
