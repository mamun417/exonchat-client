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

let exonChatIFrame = document.createElement('iframe');
exonChatIFrame.src = 'http://localhost:8080/web-chat';

exonChatContainer.appendChild(exonChatIFrame);
