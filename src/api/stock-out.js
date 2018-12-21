/**
 * Created by user on 2017/3/10.
 */
import {http} from '../lib/http-plus';
//列表
export const url_stock_out = "get|stock-out"
export const stock_out = function (data) {
    return http(url_stock_out, data);
};
//获取入库类型
export const url_stock_types = "get|stock-out/types"
export const stock_types = function () {
    return http(url_stock_types);
};
//获取状态
export const url_stock_status = "get|stock-out/statuses"
export const stock_status = function () {
    return http(url_stock_status);
};
//查看

export const url_stock_lookup = "get|stock-out/:id"
export const stock_lookup = function (id) {
    return http(Url2(url_stock_lookup, {id: id}));
};

export const url_del = "delete|stock-out/:id"
export const api_del = function (id) {
    return http(Url2(url_del, {id: id}));
};

//审核
export const url_do_stock_audit = "post|stock-out/audit"
export const stock_audit = function (data) {
    return http(url_do_stock_audit, data);
};

//出库
export const url_do_stock_out = "post|stock-out/do-stock-out"
export const do_stock_out = function (data) {
    return http(url_do_stock_out, data);
};

//新建出库单
export const url_post_stock = "post|stock-out";
export const api_post_stock = function (data) {
    return http(Url2(url_post_stock), data);
};

//出库导出
export const url_stock_out_export = "post|stock-out/export";
export const api_stock_out_export = function (data) {
    return http(url_stock_out_export, data);
};
//第三方出库
export const url_third_stock_out = "post|stock-out/third-out";
export const api_third_stock_out = function (data) {
    return http(url_third_stock_out, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};
//导出字段列表
export const url_stock_out_export_title = "get|stock-out/export-fields";
export const api_stock_out_export_title = function () {
    return http(url_stock_out_export_title);
};

//添加商品列表
export const url_stock_out_get_goods = "get|stock-out/get-goods";
export const api_stock_out_get_goods = function (data) {
    return http(url_stock_out_get_goods, data);
};

//导入商品
export const url_stock_out_import = "post|stock-out/import-goods";
export const api_stock_out_import = function (data) {
    return http(url_stock_out_import, data);
}