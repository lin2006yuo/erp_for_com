import {http} from '../lib/http-plus';

//获取vova订单列表信息
export const url_api_order_vova_list = "get|vova-orders";
export const api_order_vova_list = function(data){
    return http(url_api_order_vova_list,data);
};

//获取所有订单状态
export const url_api_order_vova_status = "get|vova-orders/status-count";
export const api_order_vova_status = function(data){
    return http(url_api_order_vova_status,data);
};

//查看vova订单详情
export const url_api_order_vova_check = "get|vova-orders/:id";
export const api_order_vova_check = function(id){
    return http(Url2(url_api_order_vova_check,{id:id}));
};

//获取账号简称
export const url_account_list = "get|orders/account";
export const api_account_list = function(data){
    return http(url_account_list, data);
};
