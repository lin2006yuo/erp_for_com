/**
 * Created by RondaFul on 2016/11/22.
 */
import {http} from '../lib/http-plus';

export const url_order_amanzon_list = "get|amazon-orders"
export const order_amanzon_list = function(data){
  return http(url_order_amanzon_list,data);
};

export const url_order_amanzon_check = "get|amazon-orders/:id"
export const order_amanzon_check = function(id){
  return http(Url2(url_order_amanzon_check,{id:id}));
};

export const url_order_amanzon_status = "get|amazon/order_status"
export const api_order_amanzon_status = function(data){
  return http(url_order_amanzon_status,data);
};

export const url_order_amanzon_site = "get|amazon/site"
export const api_order_amanzon_site = function(){
  return http(url_order_amanzon_site);
};

export const url_order_amanzon_account = "get|amazon-account"
export const api_order_amanzon_account = function(){
  return http(url_order_amanzon_account);
};

/*获取渠道账号*/
export const url_account_list = "get|orders/account"
export const api_account_list = function(data){
  return http(url_account_list, data);
};
//同步ebay订单状态
export const url_post_amazon_orders_sysc = "post|amazon-orders/sysc";
export const api_post_amazon_orders_sysc = function(data){
    return http(url_post_amazon_orders_sysc,data)
};
//下载导入模版
export const url_get_ebay_orders_export_transfer_template = "get|amazon-orders/export-transfer-template";
export const api_get_ebay_orders_export_transfer_template = function(data){
    return http(url_get_ebay_orders_export_transfer_template,data)
};
//导入模版
export const url_post_ebay_orders_import_transfer = "post|amazon-orders/import-transfer";
export const api_post_ebay_orders_import_transfer = function(data){
    return http(url_post_ebay_orders_import_transfer,data, {
        contentType:'application/x-www-form-urlencoded',
        timeout:90000
    })
};
//获取可选导出字段
export const url_get_amazon_orders_export_fields = "get|amazon-orders/export-fields";
export const api_get_amazon_orders_export_fields = function(data){
    return http(url_get_amazon_orders_export_fields,data)
};
//导出excel
export const url_post_amazon_orders_export = "post|amazon-orders/export";
export const api_post_amazon_orders_export = function(data){
    return http(url_post_amazon_orders_export,data)
};
//推送至订单系统
export const url_push_amazon_order = "post|amazon-orders/push-amazon-order";
export const api_push_amazon_order = function(data){
    return http(url_push_amazon_order,data)
};
//抓取亚马逊订单
export const url_catch_amazon_order = "post|amazon-orders/sysc-amazon-order";
export const api_catch_amazon_order = function(data){
    return http(url_catch_amazon_order,data)
};
