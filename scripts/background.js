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
        if (curText.trim().length != 0 && (i >= 12 && i <= 20)) {
            let divWrapper = document.createElement('div');
            let pTag = document.createElement('p');
            let btnAddTag = document.createElement('button');

            //create a btn tag and a p tag inside a row data
            pTag.innerText = curText;
            btnAddTag.innerHTML = '<b>+</b>';

            // init css
            divWrapper.classList.add('ntnt-row-data');
            btnAddTag.classList.add('ntnt-row-data__btn-add');

            // append tags
            divWrapper.append(pTag);
            divWrapper.append(btnAddTag);

            returnDiv.append(divWrapper);
        }
        i++;
    }

    return {
        htmlStr: returnDiv.innerHTML,
        currentWord: currentWord
    };
}

chrome.runtime.onConnect.addListener(port => {
    console.log('connected ', port);

    if (port.name == 'port1') {
        port.onMessage.addListener(function (msg, sender) {
            if (msg.type == 'word') {

                //get the translated data by using ajax
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
            if(msg.type == 'word-add'){
                addToLocalStorage(msg.value);
            }
        });
    }
});

function addToLocalStorage(object){
    let strData = localStorage.getItem(NTNT_LOCAL_STORAGE_KEY);
    
    //curData must be an array
    let curData = [];
    if(strData)
        curData = JSON.parse(strData);
    curData.push(object);

    //save to local storage
    localStorage.setItem(NTNT_LOCAL_STORAGE_KEY, JSON.stringify(curData));
}