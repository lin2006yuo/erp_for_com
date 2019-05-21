import {http} from '../lib/http-plus';

//今日看盘接口
export const url_report_today = "get|warehouse/report/today";
export const api_report_today = function (data) {
    return http(url_report_today, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};
// 今日看板仓库统计表一
export const url_report_today_one = "get|warehouse/report/warehouse-statistics-one";
export const api_report_today_one = function (data) {
    return http(url_report_today_one, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};
// 今日看板仓库统计表二
export const url_report_today_two = "get|warehouse/report/warehouse-statistics-two";
export const api_report_today_two = function (data) {
    return http(url_report_today_two, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};
//今日看板产能统计
export const url_report_today_capacity = "get|warehouse/report/capacity-statistics";
export const api_report_today_capacity = function (data) {
    return http(url_report_today_capacity, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
}