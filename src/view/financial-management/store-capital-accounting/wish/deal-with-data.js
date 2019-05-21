
export function isMinus(curCode,rmbCode,CurUnit) {
    let rmb ='¥',curUnit='，'+CurUnit;
    if(!!curCode&&!!rmbCode){
        if(curCode.indexOf('-')>-1||rmbCode.indexOf('-')>-1){
            rmb='-¥';
            curUnit='，-'+CurUnit;
            return (rmb+rmbCode.substr(1)+curUnit+curCode.substr(1)).split('，');
        }else{
            return (rmb+rmbCode+'，'+curUnit+curCode).split('，');
        }
    }else if(!!curCode&&rmbCode===undefined){
        if(curCode.indexOf('-')>-1){
            rmb='-¥';
            return rmb+curCode.substr(1);
        }else{
            return rmb+curCode;
        }
    }
}

export function wishIsMinus(money,unit) {
    if(money&&unit){
        if(money.indexOf('-')>-1){
            return '-'+unit+money.substr(1);
        }else{
            return unit+money;
        }
    }else if(money&&unit===undefined){
        let str='%';
        if(money.indexOf('-')>-1){
            return '-'+money.substr(1)+str;
        }else {
            return money+str;
        }

    }
}