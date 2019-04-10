import {http} from '../lib/http-plus';

//列表
export const url_get_list = "get|warehouse-cargo-shift";
export const api_get_list = function (data) {
    return http(url_get_list,data)
};

//查看/审核 详情
export const url_get_look_details = "get|warehouse-cargo-shift/:id";
export const api_get_look_details = function (id,data) {
    return http(Url2(url_get_look_details, {id: id}),data)
};

//审核
export const url_put_audit = "put|warehouse-cargo-shift/check";
export const api_put_audit = function (data) {
    return http(url_put_audit,data)
};

//批量库位转移
export const url_post_batch_shift = "post|warehouse-cargo-shift/batch/shift";
export const api_post_batch_shift = function (data) {
    return http(url_post_batch_shift,data)
};

//获取本地仓
export const url_warehous_local = "get|warehouse/local";
export const api_warehous_local = function (data) {
    return http(url_warehous_local, data);
};

//excel导入移库
export const url_post_import_shift = "post|warehouse-cargo-goods/import-shift";
export const api_post_import_shift = function (data) {
    return http(url_post_import_shift, data);
};
