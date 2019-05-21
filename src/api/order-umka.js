/**
 * Created by RondaFul on 2018/9/20.
 */
import {http} from '../lib/http-plus';
//获取列表
export const url_api_order_umka_list = "get|umka-order";
export const api_order_umka_list = function(data){
    return http(url_api_order_umka_list,data);
};
//查看列表
export const url_api_order_umka_check = "get|umka-order/:id";
export const api_order_umka_check = function(id){
    return http(Url2(url_api_order_umka_check,{id:id}));
};
//获取状态
export const url_api_order_umka_status = "get|umka-order/status-count";
export const api_order_umka_status = function(data){
    return http(url_api_order_umka_status,data);
};

// ---获取账号简称
export const url_api_order_umka_getAccount = "get|orders/account";
export const api_order_umka_getAccount = function(data){
    return http(url_api_order_umka_getAccount,data);
};
