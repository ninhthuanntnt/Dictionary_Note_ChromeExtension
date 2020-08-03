let port1 = chrome.runtime.connect(null, { name: 'port1' });
let currentWord = null;
let isLoading = true;
let translatePopup = document.createElement('div');
let btnTranslate = this.document.createElement("button");
// init html
translatePopup.setAttribute('class', 'content-popup');
translatePopup.setAttribute('id', POP_UP_TRANSLATE_ID);
hideElement(translatePopup);
document.body.append(translatePopup);

btnTranslate.setAttribute('id', BTN_TRANSLATE_ID);
btnTranslate.innerText = 'Translate';
hideElement(btnTranslate);
document.body.append(btnTranslate);

document.body.addEventListener('mousedown', (e) => {
    console.log('mouse down');
    let btnTranslate = this.document.getElementById(BTN_TRANSLATE_ID);
    let translatePopup = document.getElementById(POP_UP_TRANSLATE_ID);

    hideElement(translatePopup);
    hideElement(btnTranslate)
});


document.body.addEventListener('mouseup', (event) => {
    //get text to translate
    
    let text = window.getSelection().toString();
    let selection = window.getSelection();
    currentWord = text;
    //get position of cursor to show button translate
    let btnTranslate = document.getElementById(BTN_TRANSLATE_ID);

    if (text.trim() != "") {
        isSelecting = true;
        let posX = event.pageX;
        let posY = selection.getRangeAt(0).getBoundingClientRect().bottom;

        console.log("X:", posX, "Y:",posY);
        console.log("Bounding rect", selection.getRangeAt(0).getBoundingClientRect());

        if (btnTranslate.style.display == 'none') {
            console.log('create new button');
            showElement(btnTranslate, posX, posY)

            btnTranslate.onmouseup = (e) => {

                hideElement(btnTranslate);

                // translatePopup.innerHTML = "";
                showPopupAt(posX, posY);

                e.stopPropagation();
            };
            btnTranslate.onmousedown = (e) => {
                e.stopPropagation()
            }
        }
        // connect to background.js

        port1.postMessage({ type: 'word', value: text });

        port1.onMessage.addListener(function (msg, sender) {
            if (msg.type == 'word') {
                let divTag = document.createElement('div');

                divTag.innerHTML = msg.value.htmlStr;

                setDataToTranslatePopup(divTag);

                translatePopup.onmousedown = (e) => {
                    e.stopPropagation();
                }
                translatePopup.onmouseup = (e) => {
                    e.stopPropagation();
                }
                // port1.disconnect();
            }
        });

        // port1.onDisconnect.addListener(obj => {
        //     console.log('disconnected port');
        // });
    }
});
function removeElement(el) {
    if (el !== null) {
        el.remove();
    }
}

function setDataToTranslatePopup(innerDiv) {
    translatePopup.innerHTML = "";
    if (innerDiv.innerText.trim().length > 0) {
        translatePopup.append(innerDiv);

        Array.from(document.getElementsByClassName('ntnt-row-data__btn-add')).forEach((e) => {
            e.onclick = () => {
                var data = e.previousSibling.innerText;
                port1.postMessage({
                    type: 'word-add',
                    value: {
                        rootWord: currentWord,
                        translatedWord: data
                    }
                });
            }
        });
    } else {
        let pTemp1 = document.createElement('p'), pTemp2 = document.createElement('p');
        pTemp1.innerText = 'Không có kết quả';
        pTemp1.style.color = 'var(--light-red)';
        pTemp1.style.fontWeight = 600;

        pTemp2.innerText = '(Từ không nên có đuôi \'s\',\'ed\',\'ing\' để tăng độ chính xác)';
        pTemp2.style.color = 'var(--light-blue)';
        pTemp2.style.fontWeight = 500;
        translatePopup.append(pTemp1);
        translatePopup.append(pTemp2);
    }

}

function showElement(element, posX = "0px", posY = "0px") {
    element.style.display = "block";

    element.style.top = `${posY}px`;
    element.style.left = `${posX}px`;
}

function hideElement(element) {
    element.style.display = "none";
}

function showPopupAt(posX, posY) {
    showElement(translatePopup, posX, posY);

    translatePopup.style.transform = '';
    translatePopup.style.opacity = 0;

    setTimeout(() => {
        console.log("animated");
        translatePopup.style.opacity = 1;
        translatePopup.style.transform = 'translateX(5px)';
    }, 1);
}
