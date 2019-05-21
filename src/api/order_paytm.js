/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';

// 列表
export const url_fbp_orders_list = "get|fbp-orders";
export const api_fbp_orders_list = function (params) {
    return http(Url2(url_fbp_orders_list), params);
};

//订单详情信息
export const url_fbp_orders_detail = "get|fbp-orders/read";
export const api_fbp_orders_detail = function (data) {
    return http(url_fbp_orders_detail, data);
};
//FBP订单详情信息
export const url_get_fbp_orders_read = "get|fbp-orders/read";
export const get_fbp_orders_read = function (data) {
    return http(url_get_fbp_orders_read, data);
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
//销售员
export const url_get_fbp_orders_salers = "get|fbp-orders/salers";
export const api_get_fbp_orders_salers = function(data){
    return http(url_get_fbp_orders_salers,data);
};

export const url_api_order_paytm_list = "get|paytm-orders";
export const api_order_paytm_list = function(data){
  return http(url_api_order_paytm_list,data);
};
export const url_api_order_paytm_check = "get|paytm-orders/:id";
export const api_order_paytm_check = function(id){
  return http(Url2(url_api_order_paytm_check,{id:id}));
};

export const url_api_order_paytm_status = "get|paytm-orders/status-count";
export const api_order_paytm_status = function(data){
  return http(url_api_order_paytm_status,data);
};

//---渠道账号
export const url_api_order_paytm_getAccount = "get|orders/account";
export const api_order_paytm_getAccount = function(data){
  return http(url_api_order_paytm_getAccount,data);
};
//导出订单paytm-orders/export
export const url_paytm_orders_export = "post|paytm-orders/export";
export const api_paytm_orders_export = function(data) {
    return http(url_paytm_orders_export, data);
};
