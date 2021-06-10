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

const ecChatScriptTag = document.getElementById('exhonchat-chat-frame');

const api_key = ecChatScriptTag.getAttribute('data-api-key');
const whmcs_client_id = ecChatScriptTag.getAttribute('data-whmcs-client-id');

function get_api_key() {
    return api_key;
}

addDom(document, 'div', 'exhonchat-container');

let exonChatContainer = document.getElementById('exhonchat-container');

exonChatContainer.style = containerMinimizedStyle();

let exonChatIFrame = document.createElement('iframe');
exonChatIFrame.id = 'exhonchat-iframe-container';
exonChatIFrame.style = 'border: 0';
exonChatIFrame.src = 'http://localhost:8080/web-chat';

exonChatContainer.appendChild(exonChatIFrame);

function maximizeChatPanel() {
    console.log('maximize chat panel');

    exonChatContainer.style =
        'position: fixed; bottom: 20px; right: 0px; height: 600px; width: 100%; max-width: 320px; z-index: 9999999';
    exonChatIFrame.style = 'height: 100%; border: 0';
}

function minimizeChatPanel() {
    console.log('minimize chat panel');

    exonChatContainer.style = containerMinimizedStyle();
    exonChatIFrame.style = 'border: 0';
}

function containerMinimizedStyle() {
    return 'position: fixed; bottom: 15px; right: 15px; z-index: 9999999';
}
