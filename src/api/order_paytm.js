/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';

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
