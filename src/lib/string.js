window.data2page = function (data, pageSize){
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
    for(let arg of args){
        for(let elemnt of arg){
            if(result.indexOf(elemnt) <= -1){
                result.push(elemnt)
            }
        }
    }
    return result;
};
