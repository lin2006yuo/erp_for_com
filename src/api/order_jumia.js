/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';

export const url_api_order_jumia_list = "get|jumia-orders";
export const api_order_jumia_list = function(data){
  return http(url_api_order_jumia_list,data);
};

export const url_api_order_jumia_check = "get|jumia-orders/:id";
export const api_order_jumia_check = function(id){
  return http(Url2(url_api_order_jumia_check,{id:id}));
};

export const url_api_order_jumia_status = "get|jumia-orders/status-count";
export const api_order_jumia_status = function(data){
  return http(url_api_order_jumia_status,data);
};

//---渠道账号
export const url_api_order_jumia_getAccount = "get|orders/account";
export const api_order_jumia_getAccount = function(data){
  return http(url_api_order_jumia_getAccount,data);
};
//导出订单jumia-orders/export
export const url_jumia_orders_export = "post|jumia-orders/export";
export const api_jumia_orders_export = function(data) {
    return http(url_jumia_orders_export, data);
};
