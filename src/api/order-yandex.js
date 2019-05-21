/**
 * Created by RondaFul on 2018/9/22.
 */
import {http} from '../lib/http-plus';
//获取列表
export const url_api_order_yandex_list = "get|yandex-orders";
export const api_order_yandex_list = function(data){
    return http(url_api_order_yandex_list,data);
};
//查看列表
export const url_api_order_yandex_check = "get|yandex-orders/:id";
export const api_order_yandex_check = function(id){
    return http(Url2(url_api_order_yandex_check,{id:id}));
};
//获取状态
export const url_api_order_yandex_status = "get|yandex-orders/status-count";
export const api_order_yandex_status = function(data){
    return http(url_api_order_yandex_status,data);
};

// 获取账号简称
export const url_api_order_yandex_getAccount = "get|orders/account";
export const api_order_yandex_getAccount = function(data){
    return http(url_api_order_yandex_getAccount,data);
};
