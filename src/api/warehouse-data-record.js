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
//未拆包
export const url_get_unpacked = 'get|report/unpacked';
export const api_get_unpacked = function (data) {
    return http(url_get_unpacked, data)
};
//未发货
export const url_get_unshipped = 'get|report/unshipped';
export const api_get_unshipped = function (data) {
    return http(url_get_unshipped, data)
}




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
// 导出 -- 未拆包
export const url_get_unpacked_export = 'post|report/unpacked/export';
export const api_get_unpacked_export = function (data) {
    return http(url_get_unpacked_export, data);
};
// 导出 -- 未发货
export const url_get_unshipped_export = 'post|report/unshipped/export';
export const api_get_unshipped_export = function (data) {
    return http(url_get_unshipped_export, data);
};
