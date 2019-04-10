/**
 * Created by RondaFul on 2018/9/20.
 */
import {http} from '../lib/http-plus';
//获取列表
export const url_shopee_order_list = "get|fbs-orders/index";
export const api_shopee_order_list = function(data){
    return http(url_shopee_order_list,data);
};
//查看列表
export const url_shopee_thailand_look = "get|fbs-orders/read";
export const api_shopee_thailand_look = function(data){
    return http(url_shopee_thailand_look,data);
};
//导出
export const url_fbs_order_exprot = "post|fbs-orders/export";
export const api_fbs_order_exprot = function(data){
    return http(url_fbs_order_exprot,data);
};
// 获取模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
//获取导出字段
export const url_fbs_export_fields = "get|fbs-orders/export-fields";
export const api_fbs_export_fields = function(data) {
    return http(Url2(url_fbs_export_fields), data);
};
