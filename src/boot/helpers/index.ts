import { boot } from 'quasar/wrappers';
import * as _l from 'lodash';
import helpers from 'boot/helpers/helpers';
import mitt from 'mitt';

require('colors');

declare global {
    interface Window {
        clog: any;
    }
}

window.clog = (text: any, type = 'black') => console.log(text[type]);
const emitter = mitt();

export default boot(({ app }) => {
    app.config.globalProperties.$_ = _l;
    app.config.globalProperties.$emitter = emitter;
    app.config.globalProperties.$helpers = helpers;
});
