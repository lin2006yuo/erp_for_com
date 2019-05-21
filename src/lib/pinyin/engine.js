/**
 * 建立索引
 * @param   {[string]|[Object]}	 data         数据
 * @param	{string|[string]}    indexs       如果 data 为 [Object]，这里需要建立拼音索引 key
 * @param   {array}              dict         词典数据
 */
class Engine {
    constructor(data, indexs = [], dict = {}, pageSize = 10000) {
        this.indexs = [];
        this.history = { keyword: '', indexs: [], data: [] };
        this.data = data;
        this.dict = dict;
        this.pageSize = pageSize;
        this._pages = {};

        // 建立拼音关键词索引
        indexs = typeof indexs === 'string' ? [indexs] : indexs;
        for (const item of data) {
            let keywords = [];

            if (typeof item === 'string') {
                keywords = [Engine.participle(item, dict)];
            } else {
                for (const key of indexs) {
                    const words = item[key];
                    if (words) {
                        keywords.push(Engine.participle(words, dict));
                    }
                }
            }


            this.indexs.push(keywords);
        }
    }

    /**
     * 查询
     * @param   {string}    keyword     拼音或者关键字
     * @return  {[string]|{Object}}
     */
    query(keyword) {

        keyword = keyword.replace(/\s/g, '').toLowerCase();

        let indexs = this.indexs;
        let data = this.data;
        const history = this.history;
        const result = [];

        // 性能优化：在上一次搜索结果中查询
        if (history.data.length && keyword.indexOf(history.keyword) === 0) {
            indexs = history.indexs;
            data = history.data;
        }
        history.keyword = keyword;
        history.indexs = [];

        for (let index = 0; index < indexs.length; index ++) {
            let ind = indexs[index];
            if (this.match(keyword, ind)) {
                history.indexs.push(ind);
                result.push(data[index]);
            }
        }
        return result;
    }

    page(keyword, page = 1){
        keyword = keyword.replace(/\s/g, '').toLowerCase();

        let indexs = this.indexs;
        let data = this.data;
        const history = this.history;
        const result = [];

        // 性能优化：在上一次搜索结果中查询
        if (history.data.length && keyword.indexOf(history.keyword) === 0) {
            indexs = history.indexs;
            data = history.data;
        }
        history.keyword = keyword;
        history.indexs = [];

        for (let index = 0; index < indexs.length; index ++) {
            let ind = indexs[index];
            if (this.match(keyword, ind)) {
                history.indexs.push(ind);
                result.push(data[index]);
            }
        }
        this._pages[page] = result;
        return result;
    }

    match(pattern, indexs, opts) {
        for(let index of indexs){
            if(this.matchIndex(pattern, index)){
                return true;
            }
        }
        return false;
    };

    matchIndex(string, index){
        const len = string.length;
        const ilen= index.length;
        let ch;
        let str;
        let result = [];
        let pos = 0;
        let ind = 0;
        while((pos < len) && (ilen > ind)){
            ch = index[ind];
            str =string[pos];
            if((typeof ch) === 'string'){
                if(ch === str){//找到，都右移
                    result[pos] = ch;
                    ind +=1;
                    pos +=1;
                }else{//找不到，看看会不会在下个索引中
                    ind +=1;
                    if(result.length >= 1){
                        result[result.length] = false;
                    }
                }
                continue;


            }
            if(ch instanceof Number){
                if(String(ch) === str){//找到，都右移
                    result[result.length] = ch;
                    ind +=1;
                    pos +=1;
                }else{//找不到，看看会不会在下个索引中
                    ind +=1;
                    if(result.length >= 1){
                        result[result.length] = false;
                    }
                }
                continue;
            }
            if(ch instanceof Array){
                let [char, pinyin] = ch;
                if(char === str){
                    result[result.length] = char;
                    ind+=1;
                    pos+=1;
                    continue;
                }
                let m = false;
                let mm = pinyin.indexOf(str) >= 0;
                while(mm){
                    m = true;
                    if(pinyin.indexOf(str +string[pos+1]) >=0){
                        str +=string[pos+1]
                        pos+=1;
                    }else{
                        mm = false;
                    }
                }
                if(m){
                    result[result.length] = str;
                    pos+=1;
                }else{
                    if(result.length >= 1){
                        result[result.length] = false;
                    }
                }
                ind+=1;
            }

        }
        if(result.length > 0){
            return !result.some(r => r === false);
        }else{
            return false;
        }


    }


    /**
     * 将内容进行分词
     * @param	{string}		  words        目标字符串
     * @param   {Object}          dict         字典
     * @return	{string}
     */
    static participle(words, dict) {
        words = words.replace(/\s/g, '').toLowerCase();
        let result = `${words}`;
        const keywords = [];

        for (const char of words) {
            let pinyin = dict[char];
            if (pinyin) {
                [pinyin] = pinyin;
                keywords.push([char, pinyin]);
            }else{
                keywords.push(char)
            }
        }
        return keywords;
    }
};

module.exports = Engine;
