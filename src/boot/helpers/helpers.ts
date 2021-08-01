import moment from 'moment';
import * as _l from 'lodash';
import 'moment-precise-range-plugin';

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

    myDate(timestamp: string, format = 'MMMM Do YYYY') {
        return moment(timestamp).format(format);
    },

    getMySocketSessionId(type = 'user') {
        if (type === 'user') {
            return sessionStorage.getItem('ec_user_socket_ses_id');
        }

        return localStorage.getItem('ec_client_socket_ses_id');
    },

    showErrorNotification(vm: any, message: any, color = 'negative', textColor = 'white') {
        vm.$q.notify({
            color: color,
            textColor: textColor,
            message: message,
            position: 'top',
        });
    },

    showSuccessNotification(vm: any, message: any) {
        vm.$q.notify({
            color: 'positive',
            message: message,
            position: 'top',
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
};

export default helpers;
