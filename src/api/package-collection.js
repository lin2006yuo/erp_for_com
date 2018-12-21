import {http} from '../lib/http-plus';
//获取仓库
export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function () {
    return http(url_entrepot_picking)
};

//集包管理状态
export const url_get_status = "get|package-collection/status";
export const api_get_status = function () {
    return http(url_get_status)
};

//集包单列表
export const url_get_collection = "get|package-collection";
export const api_get_collection = function (data) {
    return http(url_get_collection, data)
};

//集包管理左边菜单
export const url_get_menu = "get|package-collection/left-menu";
export const api_get_menu = function (data) {
    return http(url_get_menu, data)
};

//集包详情信息
export const url_detail_collection = "get|package-collection/:id/info";
export const api_detail_collection = function (id, data) {
    return http(Url2(url_detail_collection, {id: id}), data)
};

//批量交接
export const url_batch_collection = "post|package-collection/batch";
export const api_batch_collection = function (data) {
    return http(url_batch_collection, data)
};

//集包单包裹列表
export const url_get_packagelist = "get|package-collection/:id/package-list";
export const api_get_packagelist = function (id, data) {
    return http(Url2(url_get_packagelist, {id: id}), data)
};

//移除包裹
export const url_delete_package = "delete|package-collection/package/:id";
export const api_delete_package = function (id, data) {
    return http(Url2(url_delete_package, {id: id}), data)
};

//批量移除包裹
export const url_batch_delete = "post|package-collection/batch-del";
export const api_batch_delete = function (data) {
    return http(url_batch_delete, data)
};

//作废集包单
export const url_invalid_collection = "put|package-collection/cancel/:id";
export const api_invalid_collection = function (id) {
    return http(Url2(url_invalid_collection, {id: id}));
};

//批量交接
export const url_batch_out_collection = "post|package-collection/batch-out";
export const api_batch_out_collection = function (data) {
    return http(url_batch_out_collection, data)
};

//导出集包包裹
export const url_export_package = "post|package-collection/export";
export const api_export_package = function (data) {
    return http(url_export_package, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: 180000
    })
};

//批量复核成功
export const url_batch_check_package = "post|package-collection/batch-check";
export const api_batch_check_package = function (data) {
    return http(url_batch_check_package, data);
}