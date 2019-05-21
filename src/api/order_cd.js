/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';

export const url_api_order_cd_list = "get|cd-orders";
export const api_order_cd_list = function(data){
  return http(url_api_order_cd_list,data);
};

export const url_api_order_cd_check = "get|cd-orders/:id";
export const api_order_cd_check = function(id){
  return http(Url2(url_api_order_cd_check,{id:id}));
};

export const url_api_order_cd_status = "get|cd-orders/status-count";
export const api_order_cd_status = function(data){
  return http(url_api_order_cd_status,data);
};

//---渠道账号
export const url_api_order_cd_getAccount = "get|orders/account";
export const api_order_cd_getAccount = function(data){
  return http(url_api_order_cd_getAccount,data);
};
//导出订单cd-orders/export
export const url_cd_orders_export = "post|cd-orders/export";
export const api_cd_orders_export = function(data) {
    return http(url_cd_orders_export, data);
};
