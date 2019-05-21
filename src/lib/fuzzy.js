
var fuzzy = {};

// Return all elements of `array` that have a fuzzy
// match against `pattern`.
fuzzy.simpleFilter = function(pattern, array) {
    return array.filter(function(str) {
        return fuzzy.test(pattern, str);
    });
};

// Does `pattern` fuzzy match `str`?
fuzzy.test = function(pattern, str) {
    return fuzzy.match(pattern, str) !== null;
};

// If `pattern` matches `str`, wrap each matching character
// in `opts.pre` and `opts.post`. If no match, return null
fuzzy.match = function(pattern, str, opts) {
    opts = opts || {};
    let match = opts.match || function(str){return str;};
    str = match(str);
    var patternIdx = 0
        , result = []
        , len = str.length
        , totalScore = 0
        , currScore = 0
        // prefix
        , pre = opts.pre || ''
        // suffix
        , post = opts.post || ''
        // String to compare against. This might be a lowercase version of the
        // raw string
        , compareString =  opts.caseSensitive && str || str.toLowerCase()
        , ch;

    pattern = opts.caseSensitive && pattern || pattern.toLowerCase();

    // For each character in the string, either add it to the result
    // or wrap in template if it's the next string in the pattern
    for(var idx = 0; idx < len; idx++) {
        ch = str[idx];
        if(compareString[idx] === pattern[patternIdx]) {
            ch = pre + ch + post;
            patternIdx += 1;

            // consecutive characters should increase the score more than linearly
            currScore += 1 + currScore;
        } else {
            currScore = 0;
        }
        totalScore += currScore;
        result[result.length] = ch;
    }

    // return rendered string if we have a match for every char
    if(patternIdx === pattern.length) {
        // if the string is an exact match with pattern, totalScore should be maxed
        totalScore = (compareString === pattern) ? Infinity : totalScore;
        return {rendered: result.join(''), score: totalScore};
    }

    return null;
};

fuzzy.filter = function(pattern, arr, opts) {
    if(!arr || arr.length === 0) {
        return [];
    }
    if (typeof pattern !== 'string') {
        return arr;
    }

    opts = opts || {};
    let result = [];
    let limit = opts.limit || arr.length;
    let offset= opts.begin || 0;
    for(offset; (offset < arr.length && limit); offset++){
        let element = arr[offset];
        let str = element;
        if(opts.extract) {
            str = opts.extract(element);
        }

        let rendered = fuzzy.match(pattern, str, opts);
        if(rendered != null) {
            result[result.length] = {
                string: rendered.rendered
                , score: rendered.score
                , index: offset
                , original: element
            };
            limit -=1;
        }
    }

    // 在result匹配不到情况下,去判断一个传进来的arr长度是否大于0 且查看一下 pattern这个值在array的value中是否能找到相同值。
    // if (!result.length && arr.length) {
    //    // 前面已经做了label的匹配, 现在做value的匹配
    //    let one = arr.filter(item => item.value == pattern);
    //    if (one.length) {
    //        return {
    //            result: arr
    //        }
    //    }
    // }
    return {result:result.sort(function(a,b) {
            var compare = b.score - a.score;
            if(compare) return compare;
            return a.index - b.index;
        }), offset};

};
export default fuzzy;
