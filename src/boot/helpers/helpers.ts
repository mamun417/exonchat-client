import moment from 'moment';
import * as _l from 'lodash';

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

    myDate(timestamp: string, format = 'MMMM Do YYYY') {
        return moment(timestamp).format(format);
    },

    getMySocketSessionId(type = 'user') {
        return sessionStorage.getItem(type === 'user' ? 'ec_user_socket_ses_id' : 'ec_client_socket_ses_id');
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
