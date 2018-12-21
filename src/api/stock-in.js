/**
 * Created by user on 2017/3/8.
 */
import {http} from '../lib/http-plus';
//list
export const url_stock_in = "get|stock-in";
export const stock_in = function (data) {
    return http(Url2(url_stock_in), data);
};
//获取仓库
export const url_stock_warehouses = "get|stock-in/warehouses";
export const stock_warehouses = function () {
    return http(Url2(url_stock_warehouses));
};
//获取入库类型
export const url_stock_types = "get|stock-in/types";
export const stock_types = function () {
    return http(Url2(url_stock_types));
};
//获取状态
export const url_stock_status = "get|stock-in/statuses";
export const stock_status = function () {
    return http(Url2(url_stock_status));
};
//查看
export const url_stock_lookup = "get|stock-in/:id";
export const stock_lookup = function (id) {
    return http(Url2(url_stock_lookup, {id: id}))
};
export const url_do_stock_in = "post|stock-in/do-stock-in";
export const api_do_stock_in = function (id) {
    return http(url_do_stock_in, {id});
};
export const url_del = 'delete|stock-in/:id';
export const api_del = function (id) {
    return http(Url2(url_del, {id: id}));
};

//入库审核
export const url_post_stock_in_audit = "post|stock-in/audit";
export const api_post_stock_in_audit = function (data) {
    return http(Url2(url_post_stock_in_audit), data);
};

//新建入库单
export const url_post_stock = "post|stock-in";
export const api_post_stock = function (data) {
    return http(Url2(url_post_stock), data, {
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};

//sku/别名查询
export const url_get_goods = "get|stock-in/get-goods";
export const api_get_goods = function (data) {
    return http(Url2(url_get_goods), data);
};

//入库记录导出
export const url_stock_in_export = "post|stock-in/export";
export const api_stock_in_export = function (data) {
    return http(url_stock_in_export, data);
};

//导入字段列表
export const url_stock_in_export_title = "get|stock-in/export-fields";
export const api_stock_in_export_title = function () {
    return http(url_stock_in_export_title);
};

//入库记录导入
export const url_stock_in_import = "post|stock-in/import-goods";
export const api_stock_in_import = function (data) {
    return http(url_stock_in_import, data);
};