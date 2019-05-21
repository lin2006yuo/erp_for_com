export default function filterWords(workers, filterWords){

}



//默认特列的非法字符串！！
const SPECIAL_ILLAGE_WORDS = [
    'm',
    'cm',
    'apm',
    'es',
    'ALE'
];

function findWord(words, word){
    return words.indexOf(word) >= 0;
}

function findSentence(string, sentence) {
    return string.indexOf(sentence)>=0;
}

function isSentence(temp){
    let saveTemp=temp.split(/；|,|\.|\?|;|。|，|!|！/);
    if(saveTemp.length>1){
        return true;
    }
    return false;
}
//
export const isExistIllegalWord = function (sourceString, illegalWords, specialIllegaWords = SPECIAL_ILLAGE_WORDS){
    let upperString = sourceString.toUpperCase();
    let words = upperString.split(/；|,| |\.|\?|;|。|，|!|！|<BR \/\>|\n|<P\>|<\/P>/);
    for(let illegalWord of illegalWords){
        let temp = illegalWord.toUpperCase();
        if(isSentence(temp)){
            if(findSentence(upperString, temp)){
                return illegalWord;
            }
            continue;
        }
        if(findWord(words, temp)){
            return illegalWord;
        }
    }
    return false;
};


export const isSpecialIllegelWord = function(sourceString, specialIllageWord, specialIllageWords = SPECIAL_ILLAGE_WORDS){
    if(specialIllageWords.indexOf(specialIllageWord) <= -1){
        return false;
    }
    let preg = new RegExp(`(${specialIllageWord})`, 'i');
    return preg.test(sourceString);
};

