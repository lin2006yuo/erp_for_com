
function in_element(target, element){
    if(!target){
        return false;
    }
    if(target === element){
        return true;
    }
    return in_element(target.parentNode, element);
}

function bindEvent(eventName){
    const key = `__${eventName}__OUT__`;
    window[key] = [];
    HTMLElement.prototype[`add${eventName}`] = function (callback){
        const handle = {
            element:this,
            callback
        };
        if(!window[key].includes(handle)){
            window[key].push(handle);
            return true;
        }else{
            return false;
        }
    };
    HTMLElement.prototype[`rem${eventName}`] = function(){
        let index = window[key].indexOfFun(row=>row.element === this);
        if(index >= 0){
            window[key].splice(index, 1);
            return true;
        }else{
            return false;
        }
    };
    function eventHandle(e){
        window[key].forEach(({element,callback}) =>{
            if(!in_element(e.target, element)){
                callback();
            }
        })
    }
    document.addEventListener(eventName.toLowerCase(), eventHandle);
}

['Click','Mousedown', 'Mouseup'].forEach(eventName =>{
    bindEvent(eventName)
});
