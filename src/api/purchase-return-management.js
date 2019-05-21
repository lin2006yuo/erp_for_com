import {http} from '../lib/http-plus';

//列表数据
export const url_get_purchase_return_list = "get|purchase-return";
export const api_get_purchase_return_list = function (data) {
    return http(url_get_purchase_return_list, data);
};

//处理状态列表
export const url_get_purchase_return_status = "get|purchase-return/status";
export const api_get_purchase_return_status = function (data) {
    return http(url_get_purchase_return_status, data);
};

//获取国内运输方式
export const url_get_express = "get|express";
export const api_get_express = function () {
    return http(url_get_express);
};

//入库单信息
export const url_get_look_details = "get|purchase-return/:id";
export const api_get_look_details = function (id) {
    return http(Url2(url_get_look_details, {id: id}))
};

//出库
export const url_post_stock_out = "post|purchase-return/:id/check";
export const api_post_stock_out = function (id, data) {
    return http(Url2(url_post_stock_out, {id: id}), data)
};

//作废
export const url_delete_order = "put|purchase-return/cancel/:id";
export const api_delete_order = function (id) {
    return http(Url2(url_delete_order, {id: id}))
};