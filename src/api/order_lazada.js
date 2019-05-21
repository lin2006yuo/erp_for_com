/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';

export const url_api_order_lazada_list = "get|lazada-orders";
export const api_order_lazada_list = function(data){
  return http(url_api_order_lazada_list,data);
};

export const url_api_order_lazada_check = "get|lazada-orders/:id";
export const api_order_lazada_check = function(id){
  return http(Url2(url_api_order_lazada_check,{id:id}));
};

export const url_api_order_lazada_status = "get|lazada-orders/status";
export const api_order_lazada_status = function(data){
  return http(url_api_order_lazada_status,data);
};

//---渠道账号
export const url_api_order_lazada_getAccount = "get|orders/account";
export const api_order_lazada_getAccount = function(data){
  return http(url_api_order_lazada_getAccount,data);
};
//导出订单lazada-orders/export
export const url_lazada_orders_export = "post|lazada-orders/export";
export const api_lazada_orders_export = function(data) {
    return http(url_lazada_orders_export, data);
};
//获取站点lazada-account/site
export const url_lazada_account_site = "get|lazada/site";
export const api_lazada_account_site = function() {
    return http(url_lazada_account_site);
};
//抓取订单
export const url_lazada_orders_getallorder = "post|lazada-orders/getallorder";
export const api_lazada_orders_getallorder = function(data) {
    return http(url_lazada_orders_getallorder, data);
};
//导出列表
export const url_lazada_order_export = "post|lazada-orders/export";
export const api_lazada_order_export = function(data) {
    return http(url_lazada_order_export, data);
};
// 获取我的模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
// 获取可供选择的导出字段
export const url_lazada_orders_export_fields = "get|lazada-orders/export-fields";
export const api_lazada_orders_export_fields = function (data) {
    return http(url_lazada_orders_export_fields,data);
};
// 导出订单明细
export const url_lazada_oversea_export = "post|lazada-oversea/export";
export const api_lazada_oversea_export = function (data) {
    return http(url_lazada_oversea_export,data);
};
