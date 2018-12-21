/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';

export const url_api_order_pandao_list = "get|pandao-orders";
export const api_order_pandao_list = function(data){
  return http(url_api_order_pandao_list,data);
};

export const url_api_order_pandao_check = "get|pandao-orders/:id";
export const api_order_pandao_check = function(id){
  return http(Url2(url_api_order_pandao_check,{id:id}));
};

export const url_api_order_pandao_status = "get|pandao-orders/status-count";
export const api_order_pandao_status = function(data){
  return http(url_api_order_pandao_status,data);
};

//---渠道账号
export const url_api_order_pandao_getAccount = "get|orders/account";
export const api_order_pandao_getAccount = function(data){
  return http(url_api_order_pandao_getAccount,data);
};
//导出订单pandao-orders/export
export const url_pandao_orders_export = "post|pandao-orders/export";
export const api_pandao_orders_export = function(data) {
    return http(url_pandao_orders_export, data);
};
