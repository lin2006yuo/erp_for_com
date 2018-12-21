import{http} from '../lib/http-plus';
import {url_orders_export} from "@/api/order-local";
//列表
export const  url_amazon_orders_list = "get|report/amazon-settlement/summary";
export const api_amazon_orders_list = function (data) {
    return http(url_amazon_orders_list,data)
};
export const url_get_amazon_site = 'get|publish/amazon/site';
export const api_get_amazon_site = function(){
    return http(url_get_amazon_site);
};
//导出
export const url_amazon_orders_exports = "post|report/amazon-settlement/summary-export";
export const api_amazon_orders_exports = function (data) {
    return http(url_amazon_orders_exports,data)
};
//我的模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
//filed
export const url_amazon_filed="get|report/amazon-settlement/export-field";
export const api_amazon_filed = function (data) {
    return http(url_amazon_filed,data)
};
//详情
export const url_amazon_details = "get|report/amazon-settlement/summary-detail";
export const api_amazon_details = function (data) {
    return http(url_amazon_details,data)
};

//get|channel/seller-list
export const url_seller_list = "get|channel/seller-list";
export const api_seller_list =function (data) {
    return http(url_seller_list,data)
};