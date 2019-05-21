import {http} from '../lib/http-plus';
//获取列表
export const url_my_mall_order_list = "get|fbm-orders/index";
export const api_my_mall_order_list = function(data){
    return http(url_my_mall_order_list,data);
};
//查看列表
export const url_my_mall_look = "get|fbm-orders/read";
export const api_my_mall_look = function(data){
    return http(url_my_mall_look,data);
};
//导出
export const url_fbm_order_exprot = "post|fbm-orders/export";
export const api_fbm_order_exprot = function(data){
    return http(url_fbm_order_exprot,data);
};
// 获取模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
//获取导出字段
export const url_fbm_export_fields = "get|fbm-orders/export-fields";
export const api_fbm_export_fields = function(data) {
    return http(Url2(url_fbm_export_fields), data);
};
//订单状态
export const url_fbm_status_count = "get|fbm-orders/status-count";
export const api_fbm_status_count = function(data) {
    return http(Url2(url_fbm_status_count), data);
};

