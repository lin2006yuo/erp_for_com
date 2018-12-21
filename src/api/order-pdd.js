/**
 * Created by RondaFul on 2018/9/20.
 */
import {http} from '../lib/http-plus';
//获取列表
export const url_api_order_pdd_list = "get|pdd-order";
export const api_order_pdd_list = function(data){
    return http(url_api_order_pdd_list,data);
};
//查看列表
export const url_api_order_pdd_check = "get|pdd-order/:id";
export const api_order_pdd_check = function(id){
    return http(Url2(url_api_order_pdd_check,{id:id}));
};
//获取状态
export const url_api_order_pdd_status = "get|pdd-order/status-count";
export const api_order_pdd_status = function(data){
    return http(url_api_order_pdd_status,data);
};

// ---获取账号简称
export const url_api_order_pdd_getAccount = "get|orders/account";
export const api_order_pdd_getAccount = function(data){
    return http(url_api_order_pdd_getAccount,data);
};
//快速抓取漏单
export const url_pdd_orders_getorders = "post|pdd-orders/getorders";
export const api_pdd_orders_getorders = function(data){
    return http(url_pdd_orders_getorders,data);
};
