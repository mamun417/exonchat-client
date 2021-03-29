import { boot } from 'quasar/wrappers';
import * as _l from 'lodash';
import moment from 'moment';

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

window.clog = function (text: any) {
    console.log(text);
};

const getTempId = function () {
    return new Date().getTime();
};

const fromNowTime = function (timestamp: string) {
    return moment(timestamp).fromNow();
};

export default boot(({ app }) => {
    app.config.globalProperties.$_ = _l;
    app.config.globalProperties.$getTempId = getTempId();
    app.config.globalProperties.$fromNowTime = fromNowTime;
});

export { _l, getTempId };
