/* eslint-disable @typescript-eslint/no-unused-vars */
function addDom(d, s, id, src, crossorigin = null, integrity = null) {
    // console.log(d.body);
    var js,
        fjs = d.getElementsByTagName(s)[0];

    // console.log(js, fjs);

    if (d.getElementById(id)) return;

    js = d.createElement(s);
    js.id = id;

    if (src) js.src = src;

    if (crossorigin) js.crossorigin = crossorigin;
    if (integrity) js.integrity = integrity;

    fjs.parentNode.insertBefore(js, fjs);
}

const ecChatScriptTag = document.getElementById('exhonchat-chat-script');

const widget_id = ecChatScriptTag.getAttribute('data-widget-id');
const whmcs_client_id = ecChatScriptTag.getAttribute('data-whmcs-client-id');

addDom(document, 'div', 'exhonchat-chat-box-container');

let ecChatContainer = document.getElementById('exhonchat-chat-box-container');
ecChatContainer.style =
    'display: none; transition: all 150ms ease 0s; position: fixed; bottom: 15px; right: 15px; z-index: 9999999;';

let ecChatIFrame = document.createElement('iframe');
ecChatIFrame.id = 'exhonchat-iframe-container';
ecChatIFrame.style = 'border: 0; height: 100%; width: 100%; overflow: hidden; display: block';
ecChatIFrame.src = `${new URL(ecChatScriptTag.src).origin}/web-chat`;

ecChatContainer.appendChild(ecChatIFrame);

let getWhmcsInfoInterval = '';

// check whmcs client is logged in
function getWhmcsInfo() {
    if (exonChat.whmcs_info?.clientId && exonChat.whmcs_info?.clientEmail) {
        ecChatIFrame.contentWindow.postMessage({ res: 'whmcs_info', value: exonChat.whmcs_info }, '*');
    }

    getWhmcsInfoInterval = setInterval(() => {
        if (exonChat.whmcs_info?.clientId && exonChat.whmcs_info?.clientEmail) {
            ecChatIFrame.contentWindow.postMessage({ res: 'whmcs_info', value: exonChat.whmcs_info }, '*');
        }
    }, 5000);
}

function clear_whmcs_info_interval() {
    clearInterval(getWhmcsInfoInterval);
}

function ec_mounted() {
    // send others with are needed
    ecChatIFrame.contentWindow.postMessage({ res: 'widget_id', value: widget_id }, '*');
    getWhmcsInfo();
}

function ec_maximize_panel(styleObj = {}) {
    console.log('maximize chat panel');

    Object.keys(styleObj).forEach((styleKey) => {
        ecChatContainer.style[styleKey] = styleObj[styleKey];
    });

    ecChatIFrame.contentWindow.postMessage({ res: 'ec_maximized_panel', value: { status: true } }, '*');
}

function ec_minimize_panel(styleObj = {}) {
    console.log('minimize chat panel');

    Object.keys(styleObj).forEach((styleKey) => {
        ecChatContainer.style[styleKey] = styleObj[styleKey];
    });

    ecChatIFrame.contentWindow.postMessage({ res: 'ec_minimized_panel', value: { status: true } }, '*');
}

function ec_page_visit_info() {
    // console.log('sending page info');

    ecChatIFrame.contentWindow.postMessage(
        { res: 'page_visit_info', value: { url: window.document.URL, referrer: window.document.referrer } },
        '*'
    );
}

window.parent.document.URL;

window.addEventListener(
    'message',
    (event) => {
        if (event.origin !== new URL(ecChatScriptTag.src).origin) return;

        // console.log(event);

        const fn = event.data?.action ? window[event.data.action] : null;

        if (fn) fn(event.data?.param);
    },
    false
);
