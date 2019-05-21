/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';

export const url_api_order_joom_list = "get|joom-orders";
export const api_order_joom_list = function(data){
  return http(url_api_order_joom_list,data);
};

export const url_api_order_joom_check = "get|joom-orders/:id";
export const api_order_joom_check = function(id){
  return http(Url2(url_api_order_joom_check,{id:id}));
};

export const url_api_order_joom_status = "get|joom-orders/status-count";
export const api_order_joom_status = function(data){
  return http(url_api_order_joom_status,data);
};

//---店铺简称
export const url_api_order_joom_getAccount = "post|joom-orders/stores";
export const api_order_joom_getAccount = function(data){
  return http(url_api_order_joom_getAccount,data);
};
//导出订单joom-orders/export
export const url_joom_orders_export = "get|joom-orders/export";
export const api_joom_orders_export = function(data) {
    return http(url_joom_orders_export, data);
};
//账号
export const url_joom_orders_account_names = "post|joom-orders/account-names ";
export const api_joom_orders_account_names = function(data){
    return http(url_joom_orders_account_names, data);
};

export const url_get_joom_orders_export = "get|joom-orders/export";
export const api_get_joom_orders_export = function(data){
return http(url_get_joom_orders_export, data);
};



