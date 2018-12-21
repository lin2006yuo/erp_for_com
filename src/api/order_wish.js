/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';

export const url_orderWish_list = "get|wish-orders";
export const orderWish_list = function(data){
  return http(url_orderWish_list,data);
};

export const url_orderWish_check = "get|wish-orders/:id";
export const orderWish_check = function(id,data){
  return http(Url2(url_orderWish_check,{id:id}), data);
};

export const url_orderWish_status = "get|wish-orders/status";
export const orderWish_status = function(data){
  return http(url_orderWish_status,data);
};

//---渠道账号
export const url_orderWish_getAccount = "get|orders/account";
export const orderWish_getAccount = function(data){
  return http(url_orderWish_getAccount,data);
};
//导出订单wish-orders/export
export const url_wish_orders_export = "post|wish-orders/export";
export const api_wish_orders_export = function(data) {
    return http(url_wish_orders_export, data);
};
//同步订单状态wish_orders_online
export const url_wish_orders_online = "post|wish-orders/online";
export const api_wish_orders_online = function(data) {
    return http(url_wish_orders_online, data);
};
//下载导入模版
export const url_get_ebay_orders_export_transfer_template = "get|wish-orders/export-transfer-template";
export const api_get_ebay_orders_export_transfer_template = function(data){
    return http(url_get_ebay_orders_export_transfer_template,data)
};
//导入模版
export const url_post_ebay_orders_import_transfer = "post|wish-orders/import-transfer";
export const api_post_ebay_orders_import_transfer = function(data){
    return http(url_post_ebay_orders_import_transfer,data, {
        contentType:'application/x-www-form-urlencoded',
        timeout:90000
    })
};
//抓取订单
export const url_catch_wish_order = "post|wish-orders/pull-order";
export const api_catch_wish_order = function(data){
    return http(url_catch_wish_order,data)
};
//放款数据导入
export const url_import_settle = "post|wish-order/import-settle";
export const api_import_settle = function(data){
    return http(url_import_settle,data)
};
