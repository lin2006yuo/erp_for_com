window.data2page = function (data, pageSize){
    if(!(data instanceof Array)){
        console.error(data);
    }
    let pageData;
    let page = 1;
    let result = {};
    while((pageData= data.slice((page -1) * pageSize, (page -1) * pageSize + pageSize)) && pageData.length > 0){
        result[page] = pageData;
        page +=1;
    }
    return result;
};
window.createOrderArray = function(begin, end, step = 1){
    let result = [];
    do{
       result.push(begin);
       begin +=step;
    }while (begin < end) ;
    return result;
}

window.distinctArray = function(...argvs){
    let args = Array.prototype.slice.call(arguments);
    let result = [];
    let [callback] = args.splice(args.length-1, 1);
    let call = null;
    if(callback instanceof Function){
        call = callback;
    }else{
        args.push(callback);
    }
    for(let arg of args){
        arg = arg || [];
        for(let elemnt of arg){
            if(call){
                if(call(elemnt, result)){
                    result.push(elemnt)
                }
            }else{
                if(result.indexOf(elemnt) <= -1){
                    result.push(elemnt)
                }
            }

        }
    }
    return result;
};

window.string2query = function(str){
    let result = {};
    str.split('&').forEach(kv => {
        const s = kv.split('=');
        const k = s[0];
        result[k] = s[1] === undefined ? s[0] : s[1];
    });
    return result;
}
