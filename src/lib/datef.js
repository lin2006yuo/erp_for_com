/**
 * Created by wuchuguang on 16-11-16.
 */

import datef from 'datef';

window.datef = function (format, time) {
    if(time){
        return datef.call(null, format, time * 1000);
    }else{
        return '-- --';
    }
};

window.fdatetime = function (time, format = "YYYY-MM-dd HH:mm:ss") {
    return datef.call(null, format, time);
};


window.clone=function (obj) {
  if(null === obj){
    return obj;
  }
  if(obj instanceof Array){
    return obj.map(row => clone(row));
  }
  if(obj instanceof Object){
    let ret = {};
    Object.keys(obj).forEach(key =>{
        if(obj[key] instanceof Date){
            ret[key] = new Date(obj[key].getTime());
        } else {
            ret[key] = clone(obj[key]);
        }
    });
    return ret;
  }
  return obj;
};

window.restore=function (target,data) {
         switch (typeof data){
             case "object":
                 if(data===null){
                     target=null;
                 }else {
                     if(data instanceof Array){
                         for(let i=0;i<data.length;i++){
                             window.restore(target[i],data[i])
                         }
                     }else {
                        for(let j in data){
                            window.restore(target[j],data[j])
                        }
                     }
                 }
                 break;
             case "boolean":
                 target=data;
                 break;
             case "number":
                 target=data;
                 break;
             case "string":
                 target=data;
                 break;
         }
}
window.objlength=function (obj) {
    let length=0;
    for (let i in obj){
        if(obj.hasOwnProperty(i)){
            length++
        }
    }
    return length
};


window.timeformat = function(time, format = "yyyy-MM-dd HH:mm:ss")
{
    var t = new Date(time);
    var tf = function(i){return (i < 10 ? '0' : "") + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
};


