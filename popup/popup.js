var port2 = chrome.runtime.connect(null, { name: 'port2' });
var datas = JSON.parse(localStorage.getItem(NTNT_LOCAL_STORAGE_KEY));
var divDatasId = 'ntnt-data-note';

let xhrTest = new XMLHttpRequest();
xhrTest.open('GET', 'https://api.tracau.vn/WBBcwnwQpV89/s/H%C3%B4m%20nay%20t%C3%B4i%20vui/vi');
xhrTest.onreadystatechange = () => {
    if (xhrTest.status == 200 && xhrTest.readyState == 4) {
        console.log(xhrTest.responseText);
    }
};
xhrTest.send();

// set default selected;
var langOptions = document.querySelectorAll(".ntnt-select-box__option");
Array.from(langOptions).forEach(
    (el) => {
        if (el.value == datas.settings.langCode) {
            el.selected = true;
        } else
            el.selected = false;
    }
)

// binding events

var langSelect = document.getElementById("choose-language");
langSelect.onchange = () => {
    datas.settings.langCode = langSelect.value;
    localStorage.setItem(NTNT_LOCAL_STORAGE_KEY, JSON.stringify(datas));
    port2.postMessage({
        type: "change-lang-code",
        value: langSelect.value
    });
}

var textareaText = document.getElementById("ntnt-text");
var btnSubmitText = document.getElementById("ntnt-btn-submit-text");
var translatedText = document.getElementById("ntnt-translated-text");
btnSubmitText.onclick = function (e) {
    // get data from url
    if (textareaText.value.trim() != "") {

        let xhr = new XMLHttpRequest();
        let formData = new FormData(document.getElementById("ntnt-translate-text-form"));

        xhr.open('POST', 'https://vi.ilovetranslation.com/api/1.6/save/?ajaxtimestamp=1596270715440');
        xhr.onreadystatechange = () => {
            if (xhr.status == 200 && xhr.readyState == 4) {
                var content = getContentFromILOVETRANSLATION(xhr.responseText);
                translatedText.innerHTML = content.innerHTML;
            }
        };

        xhr.send(formData);

        e.preventDefault();
    }
}

// create element
/* 
<li>
    <p></p>
    <ul>
        <li></li>
        <li></li>
    </ul>
</li> 
*/
if (datas) {
    for (let data of datas.savedWord) {
        let liTag = document.createElement('li');
        let liTagContentHtml = `
            <p class="ntnt-data-note__word-header"></p>
            <button class="ntnt-data-note__btn-delete-word">&#215;</button>
            <ul>
                <li class="ntnt-data-note__word-content"></li>
            </ul>
        `
        // let pTagInLiTag = document.createElement('p');
        // let ulTagInLiTag = document.createElement('ul');
        // let liTagInUlTag = document.createElement('li');

        //add class
        liTag.classList.add('ntnt-data-note__row');
        // pTagInLiTag.classList.add('ntnt-data-note__word-header');
        // liTagInUlTag.classList.add('ntnt-data-note__word-content');
        liTag.innerHTML = liTagContentHtml;
        let rootWordTag = liTag.firstElementChild;
        let translatedWordTag = liTag.lastElementChild.firstElementChild;
        rootWordTag.innerText = data.rootWord;
        translatedWordTag.innerText = data.translatedWord;

        // ulTagInLiTag.append(liTagInUlTag);
        // liTag.append(pTagInLiTag);
        // liTag.append(ulTagInLiTag);
        document.getElementById(divDatasId).append(liTag);
    }
}

// add event click
Array.from(document.getElementsByClassName('ntnt-data-note__btn-delete-word')).forEach(obj => {
    obj.onclick = function () {
        let parentTag = this.parentElement;
        console.log(parentTag.querySelector('p').innerText);
        let curWord = parentTag.querySelector('p').innerText;

        deleteWord(curWord);

        parentTag.remove();
    }
});

function deleteWord(word) {
    datas.savedWord = datas.savedWord.filter((obj) => {
        if (obj.rootWord == word)
            return false;
        return true;
    });

    localStorage.setItem(NTNT_LOCAL_STORAGE_KEY, JSON.stringify(datas));
}

function getContentFromILOVETRANSLATION(datas) {
    console.log(typeof datas);

    if (typeof (datas) == 'string' || datas instanceof string) {
        datas = JSON.parse(datas);
    }

    let divTag = document.createElement("div");
    let translatedText = datas[0]["n_r"]
    let pTag = document.createElement("p");

    if (translatedText == "undefined" || translatedText == undefined)
        pTag.innerText = "Can't translate";
    else
        pTag.innerText = unescape(obj["n_r"]);

    divTag.append(pTag);

    return divTag;
}