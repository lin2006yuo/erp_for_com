/**
 * Created by RondaFul on 2017/4/5.
 */
import {http} from '../lib/http-plus';

export const url_orderPaypal_list = "get|paypal-orders"
export const orderPaypal_list = function(data){
  return http(url_orderPaypal_list, data);
};

export const url_pack_getCurrency = "get|packing/getCurrency"
export const api_pack_getCurrency = function(){
  return http(url_pack_getCurrency);
};

export const url_pack_account = "get|paypal-account/account"
export const api_pack_account = function(data){
  return http(url_pack_account, data);
};

export const url_pack_transactionType = "get|paypal-orders/transactionType"
export const api_pack_transactionType = function(){
  return http(url_pack_transactionType);
};

export const url_pack_country = "get|paypal-orders/country"
export const api_pack_country = function(){
  return http(url_pack_country);
};

//查看订单详情
export const url_paypal_orders = "get|paypal-orders/:id"
export const api_paypal_orders = function(id){
  return http(Url2(url_paypal_orders,{id:id}));
};
//同步paypal订单信息
export const url_post_paypal_orders_sync = "post|paypal-orders/sync"
export const api_post_paypal_orders_sync = function(data){
    return http(url_post_paypal_orders_sync,data);
};
