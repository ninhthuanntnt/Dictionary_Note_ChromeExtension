let btnTranslateId = 'ntnt-page-btn-translate';
let popupTranslateId = 'ntnt-page-popup-translate';
document.body.addEventListener('mousedown', (e) => {
    console.log('mouse down');
    let btnTranslate = this.document.getElementById(btnTranslateId);
    let popupTranslate = document.getElementById(popupTranslateId);
    removeElement(popupTranslate);
    removeElement(btnTranslate);
});

document.body.addEventListener('mouseup', (event) => {
    console.log('body mouseup');

    //get text to translate
    let text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    //get position of cursor to show button translate
    let btnTranslate = document.getElementById(btnTranslateId);

    if (text.trim() !== "") {
        console.log(text);
        isSelecting = true;
        let posX = event.pageX;
        let posY = event.pageY;

        if (btnTranslate === null) {
            console.log('create new button');
            btnTranslate = this.document.createElement("button");
            btnTranslate.setAttribute('id', btnTranslateId);
            btnTranslate.innerText = 'Translate';
            document.body.append(btnTranslate);

            btnTranslate.onmouseup = (e) => {
                console.log('btn clicked');
                removeElement(btnTranslate);

                showPopup();


                e.stopPropagation();
            };
            btnTranslate.onmousedown = (e) => {
                e.stopPropagation();
            }
        }
        // connect to background.js
        let port = chrome.runtime.connect(null, { name: 'port1' });

        port.postMessage({ type: 'word', value: text });

        port.onMessage.addListener(function (msg, sender) {
            if (msg.type == 'word') {
                let divTag = document.createElement('div');
                divTag.innerHTML = msg.value.htmlStr;
                document.body.append(createPopup(divTag, posX, posY));

                let popupTranslate = document.getElementById(popupTranslateId);
                popupTranslate.onmousedown = (e) => {
                    e.stopPropagation();
                }
                popupTranslate.onmouseup = (e) => {
                    e.stopPropagation();
                }
                port.disconnect();
            }
        });

        port.onDisconnect.addListener(obj => {
            console.log('disconnected port');
        });
        btnTranslate.style.top = `${posY}px`;
        btnTranslate.style.left = `${posX}px`;

        console.log(event);
    }
});
function removeElement(el) {
    if (el !== null) {
        el.remove();
    }
}

function createPopup(innerDiv, posX, posY) {
    let popupDiv = document.createElement('div');
    popupDiv.setAttribute('class', 'content-popup');
    popupDiv.setAttribute('id', popupTranslateId);
    popupDiv.style.top = `${posY}px`;
    popupDiv.style.left = `${posX}px`;
    if (innerDiv.innerText.trim().length > 0) {
        popupDiv.append(innerDiv);
    }else{
        let pTemp1 = document.createElement('p'), pTemp2 = document.createElement('p');
        pTemp1.innerText = 'Không có kết quả';
        pTemp1.style.color = 'var(--light-red)';
        pTemp1.style.fontWeight = 600;

        pTemp2.innerText = '(Từ không nên có đuôi \'s\',\'ed\',\'ing\' để tăng độ chính xác)';
        pTemp2.style.color = 'var(--light-blue)';
        pTemp2.style.fontWeight = 500;
        popupDiv.append(pTemp1);
        popupDiv.append(pTemp2);
    }
    return popupDiv;
}

function showPopup() {
    let popupTranslate = document.getElementById(popupTranslateId);
    popupTranslate.style.display = 'block';
    setTimeout(() => {
        popupTranslate.style.opacity = 1;
        popupTranslate.style.transform = 'translateX(5px)';
    }, 1);
}