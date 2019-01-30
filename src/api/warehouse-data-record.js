import {http} from '../lib/http-plus';
//例子
// export const url_get_list = "get|warehouse-cargo-shift";
// export const api_get_list = function (data) {
//     return http(url_get_list,data)
// };


//已发货
export const url_get_shipped = 'get|report/shipped';
export const api_get_shipped = function (data) {
    return http(url_get_shipped, data)
};
//缺货
export const url_get_shortage = 'get|report/shortage';
export const api_get_shortage = function (data) {
    return http(url_get_shortage, data);
};





// 导出 -- 已发货
export const url_get_shipped_export = 'post|report/shipped/export';
export const api_get_shipped_export = function (data) {
    return http(url_get_shipped_export, data);
};
// 导出 -- 缺货
export const url_get_shortage_export = 'post|report/shortage/export';
export const api_get_shortage_export = function (data) {
    return http(url_get_shortage_export, data);
};
