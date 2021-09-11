import { boot } from "quasar/wrappers";
import * as _l from "lodash";
import helpers from "boot/helpers/helpers";
import mitt from "mitt";

require("colors");

declare global {
    interface Window {
        clog: any;
        emitter: any;
        $browser_tab_id: any;
    }
}

const browser_tab_id = `${new Date().getTime()}${helpers.getRandomIntInclusive(2, 2)}`.toString();

window.clog = (text: any, type = "black") => console.log(text[type]);
const emitter = mitt();
window.emitter = emitter;

window.$browser_tab_id = browser_tab_id;

export default boot(({ app }) => {
    app.config.globalProperties.$browser_tab_id = browser_tab_id;
    app.config.globalProperties.$_ = _l;
    app.config.globalProperties.$emitter = emitter;
    app.config.globalProperties.$helpers = helpers;
});
