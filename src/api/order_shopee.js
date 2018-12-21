/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';

export const url_api_order_shopee_list = "get|shopee-order";
export const api_order_shopee_list = function(data){
  return http(url_api_order_shopee_list,data);
};

export const url_api_order_shopee_check = "get|shopee-order/:id";
export const api_order_shopee_check = function(id){
  return http(Url2(url_api_order_shopee_check,{id:id}));
};

export const url_api_order_shopee_status = "get|shopee-order/get-count";
export const api_order_shopee_status = function(data){
  return http(url_api_order_shopee_status,data);
};

//---渠道账号
export const url_api_order_shopee_getAccount = "get|orders/account";
export const api_order_shopee_getAccount = function(data){
  return http(url_api_order_shopee_getAccount,data);
};
//导出订单shopee-orders/export
export const url_shopee_orders_export = "post|shopee-orders/export";
export const api_shopee_orders_export = function(data) {
    return http(url_shopee_orders_export, data);
};
//获取站点
export const url_shopee_account_site = "get|shopee-account/site";
export const api_shopee_account_site = function(){
    return http(url_shopee_account_site);
};
