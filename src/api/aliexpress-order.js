/**
 * Created by alison on 16-11-18.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';
//1.1  获取aliexpress订单信息
export const url_aliexpress_order='get|aliexpress-order';
export const aliexpress_order=function(data){
    return http(url_aliexpress_order,data);
};
//1.2  获取查看aliexpress订单信息
export const url_aliexpress_check = 'get|aliexpress-order/:id';
export const aliexpress_check=function (id,data) {
    return http(Url2(url_aliexpress_check,{id:id}),data);
};
//1.3   获取订单状态
export const url_get_status = "get|aliexpress-order/status";
export const api_get_status = function (data) {
    return http(url_get_status,data);
};

//1.4   获取店铺ID
export const url_get_account ="get|orders/account";
export const api_get_account = function (data) {
    return http(url_get_account,data)
};
//导入excel
// aliexpress-order/import
export const url_aliexpress_import ="post|aliexpress-order/import";
export const aliexpress_order_import  = function (data) {
    return http(url_aliexpress_import,data)
};
//同步ebay订单状态
export const url_post_aliexpress_order_sysc = "post|aliexpress-order/sysc";
export const api_post_aliexpress_order_sysc = function(data){
    return http(url_post_aliexpress_order_sysc,data)
};
//获取可选导出字段
export const url_get_aliexpress_order_export_fields = "get|aliexpress-order/export-fields";
export const api_get_aliexpress_order_export_fields = function(data){
    return http(url_get_aliexpress_order_export_fields,data)
};
//导出excel
export const url_post_aliexpress_order_export = "post|aliexpress-order/export";
export const api_post_aliexpress_order_export = function(data){
    return http(url_post_aliexpress_order_export,data)
};

//速卖通推送至系统订单 速卖通抓取订单
export const url_aliexpress_order_push_aliorder = "post|aliexpress-order/push-aliorder";
export const api_aliexpress_order_push_system_order = (data)=> {
    return http(url_aliexpress_order_push_aliorder,data);
};

//抓取速卖通订单
export const api_grab_aliexpress_order = (data)=>{
    return http("post|aliexpress-order/sysc-aliorder",data);
};
