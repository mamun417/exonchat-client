import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { OfflineChatReqStateInterface } from "./state";
import _ from "lodash";

const getters: GetterTree<OfflineChatReqStateInterface, StateInterface> = {
    paginationMeta(state) {
        return state.paginationMeta;
    },

    pipeline(state) {
        return state.pipeline;
    },

    getStatusWiseCount(state) {
        const cloneStatusWiseCount = _.cloneDeep(state.statusWiseCount);
        const statusWiseCount: any = {};

        _.forEach(cloneStatusWiseCount, (countObj: any) => {
            statusWiseCount[countObj.status] = countObj["_count"];
        });

        statusWiseCount["all"] = _.sumBy(cloneStatusWiseCount, (countObj: any) => countObj["_count"]);

        // get un_resolved status count
        const unResolvedStatusCount = _.filter(cloneStatusWiseCount, (countObj: any) => countObj.status !== "solved");
        statusWiseCount["un_resolved"] = _.sumBy(unResolvedStatusCount, (countObj: any) => countObj["_count"]);

        return statusWiseCount;
    },
};

export default getters;
