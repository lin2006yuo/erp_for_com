import {http} from '../lib/http-plus';

//获取zoodmall订单列表信息
export const url_api_order_zoodmall_list = "get|zoodmall-orders";
export const api_order_zoodmall_list = function(data){
    return http(url_api_order_zoodmall_list,data);
};

//查看zoodmall订单详情
export const url_api_order_zoodmall_check = "get|zoodmall-orders/:id";
export const api_order_zoodmall_check = function(id){
    return http(Url2(url_api_order_zoodmall_check,{id:id}));
};

//获取所有订单状态
export const url_api_order_zoodmall_status = "get|zoodmall-orders/status-count";
export const api_order_zoodmall_status = function(data){
    return http(url_api_order_zoodmall_status,data);
};

//获取zoodmall账号
export const url_account_list = "get|orders/account";
export const api_account_list = function(data){
    return http(url_account_list, data);
};