/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';

export const url_api_order_walmart_list = "get|walmart-orders";
export const api_order_walmart_list = function(data){
  return http(url_api_order_walmart_list,data);
};

export const url_api_order_walmart_check = "get|walmart-orders/:id";
export const api_order_walmart_check = function(id){
  return http(Url2(url_api_order_walmart_check,{id:id}));
};

export const url_api_order_walmart_status = "get|walmart-orders/status-count";
export const api_order_walmart_status = function(data){
  return http(url_api_order_walmart_status,data);
};

//---渠道账号
export const url_api_order_walmart_getAccount = "get|orders/account";
export const api_order_walmart_getAccount = function(data){
  return http(url_api_order_walmart_getAccount,data);
};
//导出订单walmart-orders/export
export const url_walmart_orders_export = "post|walmart-orders/export";
export const api_walmart_orders_export = function(data) {
    return http(url_walmart_orders_export, data);
};
