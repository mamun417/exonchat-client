import moment from 'moment';
import * as _ from 'lodash';

console.log(_.padStart('Hello TypeScript!', 20, ' '));

// export default function ({ Vue }) {
// Vue.prototype.$moment = moment;
// Vue.prototype.$_ = lodash;
// Vue.prototype.$intervalTime = 180000; // 3 min in milsec
// Vue.prototype.$timestampToDate = function (timestamp, format = 'DD MM YYYY, h:mm:ss a') {
//     return moment(parseInt(timestamp)).format(format);
// };
// Vue.prototype.$fromNowTime = function (timestamp) {
//     return moment(parseInt(timestamp)).fromNow();
// };
// }

declare global {
    interface Window {
        clog: any;
    }
}

window.clog = function (text: any) {
    console.log(text);
};

export {};
