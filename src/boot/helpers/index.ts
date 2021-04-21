import { boot } from 'quasar/wrappers';
import * as _l from 'lodash';
import helpers from 'boot/helpers/helpers';
require('colors');

declare global {
    interface Window {
        clog: any;
    }
}

window.clog = (text: any, type = 'black') => console.log(text[type]);

export default boot(({ app }) => {
    app.config.globalProperties.$_ = _l;
    app.config.globalProperties.$helpers = helpers;
});
