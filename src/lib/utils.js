/**
 * Created by RondaFul on 2016/10/18.
 */

window.INFINITE = 'infinite';

Array.prototype.unique = function(){
    let len = this.length;
    let ret = [];
    for (let i = 0; i < len; i++) {
        const ele = this[i];
        if(!ret.includes(ele)){
            ret.push(ele);
        }
    }
    this.length = 0;
    ret.forEach(ele =>{
        this.push(ele)
    });
    return this;
};
Array.prototype.For = function (call) {
    let len = this.length;
    for (let i = 0; i < len; i++) {
        let ret = call(this[i], i);
        if (!ret) {
            break;
        }
    }
};

Array.prototype.toObject = function () {
    let len = this.length;
    let obj = {};
    for (let i = 0; i < len; i++) {
        obj[i] = this[i];
    }
    return obj;
};
window.isEmpty = function (obj) {
    if (obj instanceof Array) {
        return !obj.length;
    }
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
};

window.isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

Date.prototype.pattern = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    let week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

window.isObjectValueEqual = function isObjectValueEqual(a, b) {
    let type = typeof a;
    if (type !== typeof b) {
        return false;
    }
    switch (type) {
        case 'boolean':
            return a === b;
        case 'string':
            return a === b;
        case 'function':
            return a.toString() === b.toString();
        case 'object':
            a = obj2value(a);
            b = obj2value(b);
            let akey = Object.keys(a);
            let bkey = Object.keys(b);
            if (akey.length !== bkey.length) {
                return false;
            }
            for (let i = 0; i < akey.length; i++) {
                if (!isObjectValueEqual(a[akey[i]], b[akey[i]])) {
                    return false;
                }
            }
            return true;
        case 'array':
            if (a.length !== b.length) {
                return false;
            }
            for (let i = 0; i < a.length; i++) {
                if (!isObjectValueEqual(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        case 'number':
            return a === b;
        case 'undefined':
            return true;
        default:
            console.error(`isObjectValueEqual: ${typeof a}`);
            return false;
    }
};

String.prototype.toUpper = function toUpper() {
    var re = /-(\w)/g;
    return this.toString().replace(re, function ($0, $1) {
        return $1.toUpperCase();
    });
};
String.prototype.toHorizontal = function toHorizontal() {
    var re = /([A-Z])/g;
    return this.toString().replace(re, function ($0, $1) {
        return `-${$1.toLowerCase()}`;
    });
};
window.obj2geturl = function (url, obj) {
    let str = obj2url(obj);
    str = str ? `?${str}` : str;
    return `${url}${str}`;
};

Array.prototype.sum = function (fun) {
    if (!fun) {
        fun = function (num) {
            return num;
        }
    }
    let sum = 0;
    this.forEach(function (ele) {
        sum += fun(ele);
    });
    return sum;
};

Array.prototype.indexOfFun = function (val, connd = (old_, new_) => old_ === new_) {
    for (let i = 0; i < this.length; i++) {
        if (typeof val === 'function') {
            if (val(this[i])) {
                return i;
            }
        } else {
            if (connd(this[i], val)) {
                return i;
            }
        }
    }
    return -1;
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.one = function (connd) {
    if (typeof connd === 'function') {
        for (let i = 0; i < this.length; i++) {
            if (connd(this[i])) {
                return true;
            }
        }
        return false;
    } else {
        for (let i = 0; i < this.length; i++) {
            if (this[i] === connd) {
                return true;
            }
        }
        return false;
    }
};

Array.prototype.findRet = function (connd, judge) {
    for (let i = 0; i < this.length; i++) {
        let ret = connd(this[i]);
        if (ret !== judge) {
            return ret;
        }
    }
    return undefined;
};

Array.prototype.findRetInd = function (connd) {
    for (let i = 0; i < this.length; i++) {
        let ret = connd(this[i]);
        if (ret) {
            return {index: i, result: ret};
        }
    }
    return undefined;
};

Array.prototype.classify = function (connd) {
    let ret = {};
    for (let i = 0; i < this.length; i++) {
        let c = connd(this[i]);
        let r = ret[c] || [];
        r.push(this[i]);
        ret[c] = r;
    }
    return ret;
};

//是否被包含,是返回true,不是返回false
Array.prototype.isContained =function(compareArray){
    if(!(compareArray instanceof Array)) return false;
    if(this.length < compareArray.length) return false;
    for(let i = 0, len = compareArray.length; i < len; i++){
        if(!this.includes(compareArray[i])) return false;
    }
    return true;
};

//
function objmap(obj, connd) {
    let ret = {};
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            ret[i] = connd(obj[i]);
        }
    }
    return ret;
}

window.objmap = objmap;

function objToArray(obj, connd) {
    let ret = [];
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (connd) {
                ret.push(connd(obj[i], i));
            } else {
                ret.push(obj[i]);
            }

        }
    }
    return ret;
}

window.objToArray = objToArray;

window.obj2value = function (obj) {
    if (typeof obj !== 'object') {
        return obj;
    }
    let ret = {};
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            ret[i] = obj2value(obj[i]);
        }
    }
    return ret;
};


window.obj2url = function (obj) {
    let strs = [];

    function value2string(obj) {
        switch (typeof obj) {
            case 'object':
                return JSON.stringify(obj);
            case 'array':
                return JSON.stringify(obj);
            default:
                return obj;
        }
        return obj;
    }

    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            let templ = '';
            if (typeof obj[i] === 'number') {
                templ = `${i}=${obj[i]}`;
            } else {
                templ = `${i}=${encodeURIComponent(value2string(obj[i]))}`;
            }
            strs.push(templ);
        }
    }
    return strs.join('&');
};

window.obj2json = function (obj) {
    return JSON.stringify(obj);
};
window.timestamp = function () {
    return Math.round(millisecond() / 1000);
};

console.logtime = function () {
    console.log(`time:${millisecond()}`, ...arguments);
};

window.millisecond = function () {
    return new Date().getTime();
};

Array.prototype.seq = function (begin, end) {
    let ret = [];
    for (let i = begin; i <= end; i++) {
        ret.push(i);
    }
    return ret;
};

function trim(str) { //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

window.trim = trim;
window.date2ymdhms = function (date) {
    date = new Date(date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const min = date.getUTCMinutes();
    const sec = date.getUTCSeconds();
    return `${year}-${month}-${day} ${hour + 8}:${min}:${sec}`;
};

/**
 *
 * @param start 1为第一个
 * @param nth
 * @returns {Array}
 */
Array.prototype.split = function (start, nth) {
    let i = start;
    let ret = [];
    const length = this.length;
    while (((length) >= start) && (start <= nth)) {
        ret.push(this[start - 1]);
        start++;
    }
    return ret;
};


Array.prototype.mapExclude = function (call, exclude) {
    let ret = [];
    let size = this.length;
    for (let i = 0; i < size; i++) {
        if (exclude && !!exclude(this[i])) {
            continue;
        }
        ret.push(call(this[i]));
    }
    return ret;
};

Array.prototype.filterMap = function(call, init = []){
    let size = this.length;
    for (let i = 0; i < size; i++) {
        init = call(this[i], init);
    }
    return init;
}
