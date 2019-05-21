export function initTime(index) {
    let nowdays = new Date();
    let year = nowdays.getFullYear();
    let month = nowdays.getMonth();
    if (month == 0) {
        month = 12;
        year = year - 1;
    }
    if (month < 10) {
        month = '0' + month;
    }
    let end = new Date(year, month, 0);  // 上个月最后一天。
    let start = new Date(year, month - 1, 1); // 上个月的第一天。
    if (index === 1) {
        return start;
    } else if (index === 2) {
        return end
    }
}
