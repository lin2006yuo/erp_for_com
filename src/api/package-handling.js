/**
 * Created by Administrator on 2017/12/1.
 */
import {http} from '../lib/http-plus';
//处理异常
export const url_package_handle = "put|package-collection/problem/handle";
export const api_package_handle = function(id){
    return http(Url2(url_package_handle),id)
};

//修改预估重量
export const url_estimated_weight = "put|package-collection/problem/:id/estimated-weight";
export const api_estimated_weight = function(id, data){
    return http(Url2(url_estimated_weight, {id:id}), data)
};

//重新上架
export const url_reset_package = "put|package-collection/problem/:id/package-cancel";
export const api_reset_package = function(id, data){
    return http(Url2(url_reset_package, {id:id}), data)
};
//重新集包
export const url_renew_package = "post|package-collection/reset-collection";
export const api_renew_package = function( data){
    return http(url_renew_package, {id:data})
};
//自我生成集包
export const url_self_package = "post|package-collection/self-do";
export const api_self_package = function( data){
    return http(url_self_package, data)
};

//打印包裹
export const url_print_package = "post|delivery-check/:package_id/print";
export const api_print_package = function (package_id, data){
    return http(Url2(url_print_package, { package_id: package_id }), data);
};

//根据包裹号打印
export const url_print_packagenum = "post|delivery-check/package-number-print";
export const api_print_packagenum = function(data){
    return http(Url2(url_print_packagenum), data)
};

//根据包裹号搜索出面单信息
export const url_get_infom = "get|package-collection/problem-info";
export const api_get_infom = function(data){
    return http(Url2(url_get_infom), data)
};

//打印回调
export const url_call_package = "post|package-collection/problem/print-callback";
export const api_call_package = function(data){
    return http(Url2(url_call_package), data)
};

//继续下单
export const url_continue_package = "post|package-collection/problem/continue-order";
export const api_continue_package = function(data){
    return http(Url2(url_continue_package), data)
};

//更改物流方式
export const url_change_shipping_package = "post|package-collection/problem/change-shipping";
export const api_change_shipping_package = function(data){
    return http(Url2(url_change_shipping_package), data)
};
// package-collection/problem/continue-order
// package-collection/problem/change-shipping
