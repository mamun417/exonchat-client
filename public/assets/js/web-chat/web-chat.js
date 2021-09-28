/* eslint-disable @typescript-eslint/no-unused-vars */
function addDom(d, s, id, src, crossorigin = null, integrity = null) {
    let js;

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

ecChatContainer.style =
    "display: none; background:transparent; position: fixed; bottom: 15px; right: 15px; z-index: 9999999; overflow: hidden";

ecChatHelperContainer.style = "";

let ecChatIFrame = document.createElement("iframe");
ecChatIFrame.id = "exhonchat-iframe-container";
ecChatIFrame.style = "border: 0; height: 100%; width: 100%; overflow: hidden; display: block";
ecChatIFrame.src = `${new URL(ecChatScriptTag.src).origin}/web-chat`;

ecChatContainer.appendChild(ecChatIFrame);

ecChatHelperContainer.addEventListener("click", function () {
    ecChatIFrame.contentWindow.postMessage({ res: "ec_chat_helper_container_clicked", value: { status: true } }, "*");
});

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
        {
            res: "page_visit_info",
            value: { url: window.document.URL, referrer: window.document.referrer, page_title: window.document.title },
        },
        "*"
    );
}

function ec_show_chat_helper_container(domObj = {}) {
    ecChatHelperContainer.innerHTML = domObj.dom;

    Object.keys(domObj.style).forEach((styleKey) => {
        ecChatHelperContainer.style[styleKey] = domObj.style[styleKey];
    });

    let ecChatHelperContainerCloseBtn = document.createElement("div");
    ecChatHelperContainerCloseBtn.style = "position:absolute;top:-25px;width:15px;right:0;cursor:pointer";
    ecChatHelperContainerCloseBtn.innerHTML =
        "<svg\n" +
        '            aria-hidden="true"\n' +
        '            focusable="false"\n' +
        '            data-prefix="far"\n' +
        '            data-icon="times-circle"\n' +
        '            class="svg-inline--fa fa-times-circle fa-w-16"\n' +
        '            role="img"\n' +
        '            xmlns="http://www.w3.org/2000/svg"\n' +
        '            viewBox="0 0 512 512"\n' +
        '            style="color:rgb(96 96 96)"\n' +
        "        >\n" +
        "            <path\n" +
        '                fill="currentColor"\n' +
        '                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"\n' +
        "            />\n" +
        "        </svg>";

    ecChatHelperContainer.appendChild(ecChatHelperContainerCloseBtn);

    ecChatHelperContainerCloseBtn.addEventListener("click", function (e) {
        ecChatIFrame.contentWindow.postMessage(
            { res: "ec_chat_helper_container_closed_btn_clicked", value: { status: true } },
            "*"
        );

        e.stopPropagation();
    });
}

function ec_hide_chat_helper_container(domObj = {}) {
    Object.keys(domObj.style).forEach((styleKey) => {
        ecChatHelperContainer.style[styleKey] = domObj.style[styleKey];
    });
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
