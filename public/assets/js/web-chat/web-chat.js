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

addDom(document, 'div', 'exhonchat-container');

let exonChatContainer = document.getElementById('exhonchat-container');

exonChatContainer.style = containerMinimizedStyle();

let exonChatIFrame = document.createElement('iframe');
exonChatIFrame.style = 'height: 45px; width: 45px; border: 0';
exonChatIFrame.src = 'http://localhost:8080/web-chat';

exonChatContainer.appendChild(exonChatIFrame);

function maximizeChatPanel() {
    console.log('maximize chat panel');

    exonChatIFrame.style = 'height: 100%; border: 0';
    exonChatContainer.style =
        'position: fixed; bottom: 20px; right: 20px; height: 600px; width: 100%; max-width: 320px; z-index: 9999999';
}

function minimizeChatPanel() {
    console.log('minimize chat panel');

    exonChatContainer.style = containerMinimizedStyle();
    exonChatIFrame.style = 'height: 45px; width: 45px; border: 0';
}

function containerMinimizedStyle() {
    return 'position: fixed; bottom: 20px; right: 20px; z-index: 9999999';
}
