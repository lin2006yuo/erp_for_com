import {http} from '../lib/http-plus';

//获取首次出单SKU列表
export const url_first_order_sku_list = "get|first-order";
export const api_first_order_sku_list = function(data){
    return http(url_first_order_sku_list, data);
};

//获取渠道
export const url_get_channel = "get|orders/channel"
export const api_get_channel = function(){
    return http(url_get_channel)
};

//获取导出excel字段
export const url_get_export_title = "get|first-order/export-title"
export const api_get_export_title = function(){
    return http(url_get_export_title)
};

//导出
export const url_first_order_export = "post|first-order/export";
export const api_first_order_export = function(data,head){
    return http(url_first_order_export,data,head)
};