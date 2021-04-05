import { boot } from 'quasar/wrappers';
import * as _l from 'lodash';
import moment from 'moment';
require('colors');
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $_: any;
    }
}

declare global {
    interface Window {
        clog: any;
        $_: any;
    }
}

window.clog = function (text: any, type = 'black') {
    console.log(text[type]);
};

const getTempId = function () {
    return new Date().getTime();
};

const fromNowTime = function (timestamp: string) {
    return moment(timestamp).fromNow();
};

const getMySocketSessionId = function () {
    return sessionStorage.getItem('ec_user_socket_ses_id');
};

export default boot(({ app }) => {
    app.config.globalProperties.$_ = _l;
    app.config.globalProperties.$getTempId = getTempId();
    app.config.globalProperties.$fromNowTime = fromNowTime;
    app.config.globalProperties.$getMySocketSessionId = getMySocketSessionId();
});

export { _l, getTempId, getMySocketSessionId };
