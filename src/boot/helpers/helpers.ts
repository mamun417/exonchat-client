import moment from 'moment';

const helpers = {
    getTempId() {
        return new Date().getTime();
    },

    fromNowTime(timestamp: string) {
        return moment(timestamp).fromNow();
    },

    myDate(timestamp: string, format = 'MMMM Do YYYY') {
        return moment(timestamp).format(format);
    },

    getMySocketSessionId() {
        return sessionStorage.getItem('ec_user_socket_ses_id');
    },
};

export default helpers;
