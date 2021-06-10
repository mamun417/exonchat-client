import moment from 'moment';

const helpers = {
    getTempId() {
        return new Date().getTime();
    },

    fromNowTime(timestamp: string) {
        return moment(timestamp).fromNow();
    },

    diffAsMinute(timestamp: any) {
        return moment.duration(moment(Date.now()).diff(timestamp)).humanize();
    },

    myDate(timestamp: string, format = 'MMMM Do YYYY') {
        return moment(timestamp).format(format);
    },

    getMySocketSessionId() {
        return sessionStorage.getItem('ec_user_socket_ses_id');
    },

    showErrorNotification(vm: any, message: any) {
        vm.$q.notify({
            color: 'negative',
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
};

export default helpers;
