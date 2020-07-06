function getContent(strHtml) {
    let startDataHtmlIndex = strHtml.lastIndexOf('<td valign="top">');
    let endOfDataHtmlIndex = strHtml.indexOf('</td>', startDataHtmlIndex) + '</td>'.length;
    let htmlStr = strHtml.slice(startDataHtmlIndex, endOfDataHtmlIndex);
    let htmlObj = document.createElement('div');
    htmlObj.innerHTML = htmlStr;
    
    let returnDiv = document.createElement('div');
    let currentWord = htmlObj.querySelector('.thisword').innerText;
    // Add header word
    let h3Tag = document.createElement('h3');
    h3Tag.innerText = currentWord;
    h3Tag.style.color = 'var(--light-green)';
    returnDiv.append(h3Tag);

    let textNodeIterator = document.createNodeIterator(htmlObj, NodeFilter.SHOW_TEXT), textNode;
    let i = 0;

    while (textNode = textNodeIterator.nextNode()) {
        let curText = textNode.textContent;
        if (curText.trim().length != 0 && (i >= 12 && i<=20 )) {
            let pTag = document.createElement('p');
            pTag.innerText = curText;
            returnDiv.append(pTag);
        }
        i++;
    }
    console.log(htmlObj);
    return {htmlStr: returnDiv.innerHTML,
            currentWord: currentWord};
}


chrome.runtime.onConnect.addListener(port => {
    console.log('connected ', port);

    if (port.name == 'port1') {
        port.onMessage.addListener(function (msg, sender) {
            if (msg.type == 'word') {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', `http://vndic.net/index.php?word=${msg.value}&dict=en_vi`);
                xhr.onreadystatechange = () => {
                    if (xhr.status == 200 && xhr.readyState == 4) {
                        let contentHtml = getContent(xhr.responseText);
                        port.postMessage({
                            type: msg.type,
                            value: contentHtml
                        });
                    }
                };
                xhr.send();
            }
        });
    }
});
// chrome.runtime.onMessage.addListener({
//     function(request, sender, sendResponse) {
//         if (request.contentScriptQuery == "getWord") {
//             // var xhr = new XMLHttpRequest();
//             // xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1');
//             // xhr.onreadystatechange = () => {
//             //     if (xhr.status == 200 && xhr.readyState == 4) {
//             //         sendResponse(xhr.responseText);
//             //         console.log(xhr.responseText);
//             //     }
//             // };
//             // xhr.send();
//             // fetch('https://jsonplaceholder.typicode.com/todos/1')
//             //     .then(response => response.text())
//             //     .then(text => sendResponse(text))
//             //     .catch(error => console.log(error))
//             console.log(request);
//             console.log(sender);
//             console.log(sendResponse);
//             sendResponse({ data: 'abc' });
//         }
//     }
// });