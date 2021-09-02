import moment from "moment";
import * as _l from "lodash";
import "moment-precise-range-plugin";
import linkifyStr from "linkifyjs/string";

const notifications = {
    reqOne: new Audio("assets/sound/notification/notification-request-001.mp3"),
    replyOne: new Audio("assets/sound/notification/notification-reply-001.mp3"),
    replyTwo: new Audio("assets/sound/notification/notification-reply-002.mp3"),
};

const helpers = {
    getTempId() {
        return new Date().getTime();
    },

    fromNowTime(timestamp: string, withoutSuffix = false) {
        return moment(timestamp).fromNow(withoutSuffix);
    },

    diffAsMinute(timestamp: any) {
        return moment.duration(moment(Date.now()).diff(timestamp)).humanize();
    },

    preciseDiff(toTime: any, fromTime: any = null) {
        // @ts-ignore
        return moment.preciseDiff(fromTime || moment(Date.now()), toTime);
    },

    myDate(timestamp: string, format = "MMMM Do YYYY") {
        return moment(timestamp).format(format);
    },

    getMySocketSessionId(type = "user") {
        if (type === "user") {
            return sessionStorage.getItem("ec_user_socket_ses_id");
        }

        return localStorage.getItem("ec_client_socket_ses_id");
    },

    showErrorNotification(vm: any, message: any, color = "negative", textColor = "white") {
        vm.$q.notify({
            color: color,
            textColor: textColor,
            message: message,
            position: "top",
            badgeClass: "hidden",
        });
    },

    showWarningNotification(vm: any, message: any, color = "warning", textColor = "black") {
        vm.$q.notify({
            color: color,
            textColor: textColor,
            message: message,
            position: "top",
            badgeClass: "hidden",
        });
    },

    showSuccessNotification(vm: any, message: any) {
        vm.$q.notify({
            color: "positive",
            message: message,
            position: "top",
            badgeClass: "hidden",
        });
    },

    updatePipeline(storeState: any, payloadState: any) {
        const payloadStateKeys = Object.keys(payloadState);
        storeState = _l.cloneDeep(storeState);

        if (!payloadStateKeys.length) return storeState;

        payloadStateKeys.forEach((pipelineKey) => {
            if (storeState.hasOwnProperty(pipelineKey)) {
                storeState[pipelineKey] = payloadState[pipelineKey];
            }
        });

        return storeState;
    },

    notifications() {
        return { ...notifications };
    },

    colors() {
        return {
            defaultText: "text-grey-7",
            dateTimeText: "text-grey-6",
        };
    },

    makeCLickAbleLink(content: any, defaultProtocol = "https") {
        return linkifyStr(content, {
            defaultProtocol,
            target: "_blank",
            className: "tw-underline text-blue-7",
        });
    },
};

export default helpers;
