var port2 = chrome.runtime.connect(null, { name: 'port2' });
var datas = JSON.parse(localStorage.getItem(NTNT_LOCAL_STORAGE_KEY));
var divDatasId = 'ntnt-data-note';

// set default selected;

var langOptions = document.querySelectorAll(".ntnt-select-box__option");
Array.from(langOptions).forEach(
    (el) => {
        if(el.value == datas.settings.langCode){
            el.selected = true;
        }else
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
        let pTagInLiTag = document.createElement('p');
        let ulTagInLiTag = document.createElement('ul');
        let liTagInUlTag = document.createElement('li');

        //add class
        liTag.classList.add('ntnt-data-note__row');
        pTagInLiTag.classList.add('ntnt-data-note__word-header');
        liTagInUlTag.classList.add('ntnt-data-note__word-content');

        pTagInLiTag.innerText = data.rootWord;
        liTagInUlTag.innerText = data.translatedWord;

        ulTagInLiTag.append(liTagInUlTag);
        liTag.append(pTagInLiTag);
        liTag.append(ulTagInLiTag);
        document.getElementById(divDatasId).append(liTag);
    }
}

// add event click
Array.from(document.getElementsByClassName('ntnt-data-note__row')).forEach(obj => {
    obj.onclick = function () {
        console.log(this.querySelector('p').innerText);
        let curWord = this.querySelector('p').innerText;

        deleteWord(curWord);

        this.remove();
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