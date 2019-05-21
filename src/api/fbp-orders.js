/**
 * Created by Administrator on 2017/6/23.
 */
import {http} from '../lib/http-plus';
//获取站点
export const url_account_list = "get|orders/account"
export const api_account_list = function(params){
    return http(url_account_list, params);
};

//获取FBP订单列表
export const url_fbp_orders_list = "get|fbp-orders";
export const api_fbp_orders_list = function (params) {
    return http(Url2(url_fbp_orders_list), params);
};

//FBP订单详情信息
export const url_fba_orders_detail = "get|fba-orders/:order_id/info";
export const api_fba_orders_detail = function (id) {
    return http(Url2(url_fba_orders_detail, {order_id:id}));
};

//FBP统计
export const url_fbp_orders_report = "get|fbp-orders/report";
export const api_fbp_orders_report = function (params) {
    return http(Url2(url_fbp_orders_report), params);
};

//销量
export const url_fba_chart_data = "get|purchase-proposal/chart-data";
export const api_fba_chart_data = function (params) {
    return http(Url2(url_fba_chart_data), params);
};

// 导出
export const url_fbp_export = "post|fbp-orders/export";
export const api_fbp_export = function (params,header) {
    return http(url_fbp_export, params,header);
};
// 导出字段
export const url_fbp_field = "get|fbp-orders/export-fields";
export const api_fbp_field = function (params) {
    return http(url_fbp_field, params);
};
