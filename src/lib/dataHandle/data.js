
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
    let time = new Date()
    var year = time.getFullYear()
    var month = time.getMonth()
    var day = time.getDate()
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = new Date(year2, month2, day2);
    return t2;
}

