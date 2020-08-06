let port1 = null;
let currentWord = null;
let isLoading = true;
let translatePopup = document.createElement('div');
let btnTranslate = this.document.createElement("button");
let animationLoadingHTMLStr = `<div id = "${POP_UP_TRANSLATE_LOADING_ID}" 
                                    style="display: flex; justify-content:  center;">
                                    <div class="ntnt-loading-animation ntnt-loading-animation-spiral">

                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>`;

// init html
// init translated text popup

translatePopup.setAttribute('class', 'content-popup');
translatePopup.setAttribute('id', POP_UP_TRANSLATE_ID);
hideElement(translatePopup);
document.body.append(translatePopup);


// init translation button
btnTranslate.setAttribute('id', BTN_TRANSLATE_ID);
btnTranslate.innerText = 'Translate';
hideElement(btnTranslate);
document.body.append(btnTranslate);

//override body mousedown to hide button and popup
document.body.addEventListener('mousedown', (e) => {
    console.log('mouse down');
    let btnTranslate = this.document.getElementById(BTN_TRANSLATE_ID);
    let translatePopup = document.getElementById(POP_UP_TRANSLATE_ID);

    hideElement(translatePopup);
    hideElement(btnTranslate);

    (port1) ? port1.disconnect() : null;
});


document.body.addEventListener('mouseup', (event) => {
    port1 = chrome.runtime.connect(null, { name: 'port1' });
    console.log("Mouse up hus");
    //get text to translate
    let text = window.getSelection().toString();
    let selection = window.getSelection();
    currentWord = text;

    if (text.trim() != "") {
        isSelecting = true;
        let posX = event.pageX;
        let posY = selection.getRangeAt(0).getBoundingClientRect().bottom + window.scrollY;

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

        startLoading();
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
    console.log(innerDiv);

    translatePopup.innerHTML = "";

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

}

function startLoading() {
    translatePopup.innerHTML = animationLoadingHTMLStr;
}

function stopLoading() {
    let loadingDiv = document.getElementById(POP_UP_TRANSLATE_LOADING_ID);
    (loadingDiv) ? loadingDiv.remove() : null;
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
