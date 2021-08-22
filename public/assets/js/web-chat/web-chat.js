/* eslint-disable @typescript-eslint/no-unused-vars */
function addDom(d, s, id, src, crossorigin = null, integrity = null) {
    // console.log(d.body);
    var js;

    // console.log(js, fjs);

    if (d.getElementById(id)) return;

    js = d.createElement(s);
    js.id = id;

    if (src) js.src = src;

    if (crossorigin) js.crossorigin = crossorigin;
    if (integrity) js.integrity = integrity;

    d.body.appendChild(js);
}

const ecChatScriptTag = document.getElementById("exhonchat-chat-script");

const widget_id = ecChatScriptTag.getAttribute("data-widget-id");
const whmcs_client_id = ecChatScriptTag.getAttribute("data-whmcs-client-id");

addDom(document, "div", "exhonchat-chat-box-container");
addDom(document, "div", "exhonchat-chat-box-helper-container");

let ecChatContainer = document.getElementById("exhonchat-chat-box-container");
let ecChatHelperContainer = document.getElementById("exhonchat-chat-box-helper-container");

// ecChatHelperContainer.innerHTML =
//     '<div class="tw-flex tw-justify-end tw-mb-1">\n' +
//     "    <div>x</div>\n" +
//     "</div>\n" +
//     "<!--                <div>-->\n" +
//     '<div class="ec-help-text tw-p-2 bg-white tw-border-1">\n' +
//     "    <!--                    check letter count then use nowrap iff needed otherwise content height flickers-->\n" +
//     "    <div\n" +
//     '        class="tw-flex tw-justify-center tw-items-center tw-gap-2"\n' +
//     "    >\n" +
//     '        <div class="">\n' +
//     '            <q-icon color="blue-8" name="forum" size="45px"></q-icon>\n' +
//     "        </div>\n" +
//     '        <div class="">\n' +
//     '            <div class="tw-text-lg tw-font-bold tw-whitespace-nowrap">Need Help?</div>\n' +
//     "            <div>\n" +
//     "                Click here and start chatting with us!\n" +
//     "            </div>\n" +
//     "        </div>\n" +
//     "    </div>\n" +
//     "</div>";

ecChatContainer.style =
    "display: none; transition: all 300ms ease 0s; position: fixed; bottom: 15px; right: 15px; z-index: 9999999; overflow: hidden";

ecChatHelperContainer.style = "";

let ecChatIFrame = document.createElement("iframe");
ecChatIFrame.id = "exhonchat-iframe-container";
ecChatIFrame.style = "border: 0; height: 100%; width: 100%; overflow: hidden; display: block";
ecChatIFrame.src = `${new URL(ecChatScriptTag.src).origin}/web-chat`;

ecChatContainer.appendChild(ecChatIFrame);

let getWhmcsInfoInterval = "";

function getExonchatObj() {
    ecChatIFrame.contentWindow.postMessage({ res: "exonchat_obj", value: exonChat }, "*");
}

function ec_mounted() {
    // send others with are needed
    ecChatIFrame.contentWindow.postMessage({ res: "widget_id", value: widget_id }, "*");
}

function ec_maximize_panel(styleObj = {}) {
    console.log("maximize chat panel");

    Object.keys(styleObj).forEach((styleKey) => {
        ecChatContainer.style[styleKey] = styleObj[styleKey];
    });

    ecChatIFrame.contentWindow.postMessage({ res: "ec_maximized_panel", value: { status: true } }, "*");
}

function ec_minimize_panel(styleObj = {}) {
    console.log("minimize chat panel");

    Object.keys(styleObj).forEach((styleKey) => {
        ecChatContainer.style[styleKey] = styleObj[styleKey];
    });

    ecChatIFrame.contentWindow.postMessage({ res: "ec_minimized_panel", value: { status: true } }, "*");
}

function ec_page_visit_info() {
    ecChatIFrame.contentWindow.postMessage(
        { res: "page_visit_info", value: { url: window.document.URL, referrer: window.document.referrer } },
        "*"
    );
}

window.addEventListener(
    "message",
    (event) => {
        if (event.origin !== new URL(ecChatScriptTag.src).origin) return;

        // console.log(event);

        const fn = event.data?.action ? window[event.data.action] : null;

        if (fn) fn(event.data?.param);
    },
    false
);
