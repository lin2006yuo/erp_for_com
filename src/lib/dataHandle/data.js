
// yy - mm
export function handleY (date) {
    var oDate = new Date(date - 0);
    return oDate.getFullYear() + '-' + (oDate.getMonth() + 1 > 9 ? oDate.getMonth() + 1 : '0' + (oDate.getMonth() + 1)) 
}

// yy - mm - dd

export function handleD (date) {
    var oDate = new Date(date - 0);
    return oDate.getFullYear() + '-' + (oDate.getMonth() + 1 > 9 ? oDate.getMonth() + 1 : '0' + (oDate.getMonth() + 1)) + '-' + (oDate.getDate() > 9 ? oDate.getDate() : '0' + oDate.getDate());
} 

export function handleHou (date) {
    var oDate = new Date(date - 0);
    return oDate.getFullYear() + '-' + (oDate.getMonth() + 1 > 9 ? oDate.getMonth() + 1 : '0' + (oDate.getMonth() + 1)) + '-' + (oDate.getDate() > 9 ? oDate.getDate() : '0' + oDate.getDate()) + ' ' + (oDate.getHours() > 9 ? oDate.getHours() : '0' + oDate.getHours()) + ':' + (oDate.getMinutes() > 9 ? oDate.getMinutes() : '0' + oDate.getMinutes()) + ":" + (oDate.getSeconds() > 9 ? oDate.getSeconds() : '0' + oDate.getSeconds());
}

// 默认上一个月
export function handleMonth () {
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    var month = nowdays.getMonth();
    if(month==0){
        month = 12;
        year = year-1;
    }
    if(month<10){
        month = '0'+month;
    }         
    var end = new Date(year,month, 0);
    return end
}

