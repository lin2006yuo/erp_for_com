/**
 * Created by user on 2017/3/23.
 */
import {http} from '../lib/http-plus';
//获取仓库
export const url_get_warehouse = "get|orders/warehouse/info"
export const api_get_warehouse = function(){
  return http(url_get_warehouse)
};
//获取邮寄方式
export const url_get_post = "get|orders/shipping/info"
export const api_get_post = function(data){
  return http(url_get_post,data)
};
//手工订单列表
export const url_get_list = "get|manual-orders"
export const api_get_list = function(data){
  return http(url_get_list,data)
};
//获取账号
export const url_get_account = "get|orders/account"
export const api_get_account = function(data){
  return http(url_get_account,data)
};
//获取渠道
export const url_get_channel = "get|orders/channel"
export const api_get_channel = function(){
  return http(url_get_channel)
};
//获取销售日期
export const url_get_date = "get|manual-orders/date"
export const api_get_date = function(){
  return http(url_get_date)
};
//获取订单号
export const url_get_number = "get|manual-orders/number"
export const api_get_number = function(){
  return http(url_get_number)
};
//获取国家
export const url_get_country = "get|country"
export const api_get_country = function(){
  return http(url_get_country)
};
//获取邮寄方式分类
export const url_get_carrier = "get|warehouse/getCarrier"
export const api_get_carrier = function(){
  return http(url_get_carrier)
};
//获取邮寄方式
export const url_get_ship = "get|manual-orders/shipping"
export const api_get_ship = function(data){
  return http(url_get_ship,data)
};

//保存
export const url_add_order = "post|manual-orders"
export const add_order = function(data){
  return http(url_add_order,data)
};
//获取币种信息
export const url_get_currency = "get|supplier-offer/currency"
export const api_get_currency = function(){
  return http(url_get_currency)
};
//获取paypal订单信息
export const url_get_paypal = "get|paypal-orders"
export const api_get_paypal = function(data){
  return http(url_get_paypal,data)
};
//重新核查
export const url_post_pending = "post|orders-audit/batch/pending"
export const api_post_pending = function(data){
  return http(url_post_pending,data)
};
//导入手工订单
export const url_post_import = "post|manual-orders/import"
export const api_post_import = function(data){
    return http(url_post_import,data)
};
//保存手工订单
export const url_save_import = "post|manual-orders/save-import"
export const api_save_import = function(data){
    return http(url_save_import,data)
};
//获取订单拦截状态
export const url_get_order_hold_status = "get|order-hold/status"
export const api_get_order_hold_status = function(){
    return http(url_get_order_hold_status)
};
//手工订单导出
export const url_manual_orders_export = "post|manual-orders/export";
export const api_manual_orders_export = function(data,head){
    return http(url_manual_orders_export,data,head)
};
//获取补发手工单列表
export const url_get_manual_orders_package_list = "get|manual-orders/package-list";
export const api_get_manual_orders_package_list = function(data){
    return http(url_get_manual_orders_package_list,data)
};
//创建补发单
export const url_manual_orders_batch_replacement = "post|manual-orders/batch-replacement";
export const api_manual_orders_batch_replacement = function(data,head){
    return http(url_manual_orders_batch_replacement,data,head)
};
//获取买家信息
export const url_get_manual_orders_buyer_message = "get|manual-orders/buyer-message";
export const api_get_manual_orders_buyer_message = function(data){
    return http(url_get_manual_orders_buyer_message,data)
};

