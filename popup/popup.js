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


for(let data of datas){
    let liTag = document.createElement('li');
    let pTagInLiTag = document.createElement('p');
    let ulTagInLiTag = document.createElement('ul');
    let liTagInUlTag = document.createElement('li');

    //add class
    pTagInLiTag.classList.add('ntnt-data-note__word-header');
    liTagInUlTag.classList.add('ntnt-data-note__word-content');;

    pTagInLiTag.innerText = data.rootWord;
    liTagInUlTag.innerText = data.translatedWord;

    ulTagInLiTag.append(liTagInUlTag);
    liTag.append(pTagInLiTag);
    liTag.append(ulTagInLiTag);
    document.getElementById(divDatasId).append(liTag);
}