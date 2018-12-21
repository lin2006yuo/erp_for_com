/**
 * Created by alison on 16-11-19.
 */

import {http} from '../lib/http-plus';

export const url_get = "get|ebay-orders";
export const api_get = function(data){
  return http(url_get,data)
};

export const url_info = "get|ebay-orders/:id";
export const api_info = function(id){
  return http(Url2(url_info,{id:id}))
};

export const url_info_ebay = "get|orders/:id";
export const api_info_ebay = function(id){
  return http(Url2(url_info_ebay,{id:id}))
};

export const url_to_lead = "get|ebay-orders/toLocalOrder";
export const to_lead = function(){
  return http(url_to_lead)
};
/*获取渠道账号*/
export const url_account_list = "get|orders/account";
export const api_account_list = function(data){
  return http(url_account_list,data)
};
export const url_get_status_count = "get|ebay-orders/status-count";
export const get_status_count = function(data){
  return http(url_get_status_count,data)
};
export const url_get_ebaysite = "get|channel-categories/ebay";
export const get_ebaysite = function(){
  return http(url_get_ebaysite)
};
//同步ebay订单状态
export const url_post_ebay_orders_sysc = "post|ebay-orders/sysc";
export const api_post_ebay_orders_sysc = function(data){
    return http(url_post_ebay_orders_sysc,data)
};
//下载导入模版
export const url_get_ebay_orders_export_transfer_template = "get|ebay-orders/export-transfer-template";
export const api_get_ebay_orders_export_transfer_template = function(data){
    return http(url_get_ebay_orders_export_transfer_template,data)
};
//导入模版
export const url_post_ebay_orders_import_transfer = "post|ebay-orders/import-transfer";
export const api_post_ebay_orders_import_transfer = function(data){
    return http(url_post_ebay_orders_import_transfer,data, {
        contentType:'application/x-www-form-urlencoded',
        timeout:90000
    })
};
//获取导出字段
export const url_get_ebay_orders_export_transfer_fields = "get|ebay-orders/export-fields";
export const api_get_ebay_orders_export_transfer_fields = function(data){
    return http(url_get_ebay_orders_export_transfer_fields,data)
};
//导出
export const url_post_ebay_orders_export = "post|ebay-orders/export";
export const api_post_ebay_orders_export = function(data){
    return http(url_post_ebay_orders_export,data, {
        contentType:'application/x-www-form-urlencoded',
        timeout:90000
    })
};
