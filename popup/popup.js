var datas = JSON.parse(localStorage.getItem(NTNT_LOCAL_STORAGE_KEY));
var divDatasId = 'ntnt-data-note';

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

console.log(datas);
if (datas) {
    for (let data of datas) {
        let liTag = document.createElement('li');
        let pTagInLiTag = document.createElement('p');
        let ulTagInLiTag = document.createElement('ul');
        let liTagInUlTag = document.createElement('li');

        //add class
        liTag.classList.add('ntnt-data-note__row');
        pTagInLiTag.classList.add('ntnt-data-note__word-header');
        liTagInUlTag.classList.add('ntnt-data-note__word-content');;

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
    let localData = JSON.parse(localStorage.getItem(NTNT_LOCAL_STORAGE_KEY));
    console.log(localData);
    localData = localData.filter((obj) => {
        if (obj.rootWord == word)
            return false;
        return true;
    });

    localStorage.setItem(NTNT_LOCAL_STORAGE_KEY, JSON.stringify(localData));
}   