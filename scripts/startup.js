var localDataStr = localStorage.getItem(NTNT_LOCAL_STORAGE_KEY);
var defaultLocalData = {
    savedWord: [],
    settings: {
        langCode: DEFAULT_LANG_CODE
    }
}
if(localDataStr == null){
    localStorage.setItem(JSON.stringify(defaultLocalData));
}