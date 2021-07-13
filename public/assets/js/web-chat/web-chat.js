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
ecChatContainer.style = 'display: none';

let ecChatIFrame = document.createElement('iframe');
ecChatIFrame.id = 'exhonchat-iframe-container';
ecChatIFrame.style = 'border: 0; height: 100%; width: 100%; overflow: hidden; display: block';
ecChatIFrame.src = `${new URL(ecChatScriptTag.src).origin}/web-chat`;

ecChatContainer.appendChild(ecChatIFrame);

function ec_mounted() {
    // send others with are needed
    ecChatIFrame.contentWindow.postMessage({ res: 'widget_id', value: widget_id }, '*');
}

function ec_maximize_panel(style = 'position: fixed; bottom: 20px; right: 0px; z-index: 9999999') {
    console.log('maximize chat panel');

    ecChatContainer.style = style;
}

function ec_minimize_panel(style = 'position: fixed; bottom: 20px; right: 0px; z-index: 9999999') {
    console.log('minimize chat panel');

    ecChatContainer.style = style;
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
