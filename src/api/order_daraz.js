/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';
//列表接口
export const url_order_daraz_list = "get|daraz-orders";
export const api_order_daraz_list = function(data){
    return http(url_order_daraz_list,data);
};
//列表查看详情
export const url_api_order_daraz_check = "get|daraz-orders/:id";
export const api_order_daraz_check = function(id){
    return http(Url2(url_api_order_daraz_check,{id:id}));
};
//搜索列表 订单状态
export const url_api_order_daraz_status = "get|daraz-orders/status";
export const api_order_daraz_status = function(data){
    return http(url_api_order_daraz_status,data);
};

//---渠道账号
export const url_api_order_daraz_getAccount = "get|daraz-account";
export const api_order_daraz_getAccount = function(data){
    return http(url_api_order_daraz_getAccount,data);
};

//获取站点/daraz-account/sites
export const url_daraz_account_site = "get|daraz-account/sites";
export const api_daraz_account_site = function() {
    return http(url_daraz_account_site);
};
