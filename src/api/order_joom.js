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

//---渠道账号
export const url_api_order_joom_getAccount = "get|orders/account";
export const api_order_joom_getAccount = function(data){
  return http(url_api_order_joom_getAccount,data);
};
//导出订单joom-orders/export
export const url_joom_orders_export = "post|joom-orders/export";
export const api_joom_orders_export = function(data) {
    return http(url_joom_orders_export, data);
};
