/**
 * Created by wuchuguang on 16-11-22.
 */

import {http} from '../lib/http-plus';

export const url_get = "get|orders";
export const api_get = function(data){
  return http(url_get, data,{
        contentType:'application/x-www-form-urlencoded',
            timeout:60000
    });
};

//订单系统-缺货订单页面
export const url_get_stock_orders = "get|stock-orders";
export const api_get_stock_orders = function(data){
    return http(url_get_stock_orders, data,{
        contentType: 'application/x-www-form-urlencoded',
        timeout: 60000
    });
};

export const url_info = "get|orders/:id";
export const api_info = function(id){
    return http(Url2(url_info,{id:id}));
};

export const url_update = "put|orders/:id";
export const api_update = function(id, updates){
  return http(Url2(url_update,{id:id}), updates);
};

export const url_status_operation = "get|orders/operation/info";
export const api_status_operation = function(data){
  return http(url_status_operation, data);
};

export const url_change_status = "post|orders/:order_id/status/:status";
export const api_change_status = function(order_id,status,data){
  return http(Url2(url_change_status,{order_id:order_id,status:status}),data);
};

export const url_cancel_invalid = "post|orders/:order_id/status/cancel-invalid";
export const api_cancel_invalid = function(order_id,status,data){
  return http(Url2(url_cancel_invalid,{order_id:order_id}));
};

//删除备注
export const url_delete_note = "post|orders/:order_id/delNote";
export const api_delete_note = function(order_id,id){
  return http(Url2(url_delete_note,{order_id:order_id}),{id:id});
};

//获取本地订单状态列表
export const url_status_list = "get|orders/statusList/info";
export const api_status_list = function(){
  return http(url_status_list, {});
};

export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
  return http(url_account_list, datas);
};
/*邮件设置中的账号接口
* */
export const url_email_account = "get|email-account/account";
export const api_email_account = function(datas){
    return http(url_email_account, datas);
};

export const url_get_shop = "get|orders/getGoods";
export const api_get_shop = function(datas){
  return http(url_get_shop, datas);
};

export const url_order_product = "get|orders/:order_id/detail";
export const api_order_product = function(id){
  return http(Url2(url_order_product,{order_id:id}));
};

export const url_get_warehouse = "get|orders/warehouse/info";
export const api_get_warehouse = function(){
  return http(url_get_warehouse);
};

export const url_get_shipping = "get|manual-orders/shipping";
export const api_get_shipping = function(data){
  return http(url_get_shipping, data);
};

export const url_get_country = "get|country";
export const api_get_country = function(data){
  return http(url_get_country);
};

export const url_get_already = "post|orders-audit/batch/:type"
export const api_get_already = function(data){
  return http(Url2(url_get_already,{type:"already"}), data);
};

//进度条
export const url_get_speed = "get|orders/:id/speed"
export const api_get_speed = function(id){
  return http(Url2(url_get_speed,{id:id}));
};

// 手动生成
export const url_get_generate = "get|orders/:order_id/generate";
export const api_get_generate = function(id,data){
  return http(Url2(url_get_generate,{order_id:id}),data);
};

//获取采购员
export const url_get_seller = "get|user/:type/staffs";
export const api_get_seller = function(data){
  return http(Url2(url_get_seller,{type:"sales"}), data);
};
//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};
//获取拆包裹的订单信息
export const url_get_splitInfo = "get|orders/:id/split";
export const api_get_splitInfo = function(id, data){
  return http(Url2(url_get_splitInfo,{id:id}), data);
};
//获取拆包的标题
export const url_get_export_title = "get|providers-exception/export-title";
export const api_get_export_title = function(data){
    return http(url_get_export_title, data);
};
//保存拆包裹信息
export const url_keep_splitInfo = "post|orders/:order_id/split";
export const api_keep_splitInfo = function(id, data){
  return http(Url2(url_keep_splitInfo,{order_id:id}), data);
};

//获取合并包裹的订单信息
export const url_get_mergeInfo = "get|orders/:id/merge";
export const api_get_mergeInfo = function(id,data){
  return http(Url2(url_get_mergeInfo,{id:id}),data);
};

//保存合并包裹信息
export const url_keep_mergeInfo = "post|orders/:order_id/merge";
export const api_keep_mergeInfo = function(id, data){
  return http(Url2(url_keep_mergeInfo,{order_id:id}), data);
};

//拆包查询库存warehouse-goods
export const url_warehouse_goods = "get|warehouse-goods/available_quantity";
export const api_warehouse_goods = function(data){
  return http(url_warehouse_goods, data);
};

//使用paypal地址
export const url_use_paypal_source = "post|orders/:id/address";
export const api_use_paypal_source = function(id, data){
  return http(Url2(url_use_paypal_source,{id:id}), data);
};

//查看是否已关联
export const url_map = "get|sku-map/map";
export const api_map = function(data){
    return http(url_map,data);
};
//开始同步
export const url_brush_orders = "post|brush-orders/start";
export const api_brush_orders = function(data){
    return http(url_brush_orders,data);
};
//设置同步发货
export const url_brush_shipments = "post|brush-orders/:order_id/synchronize";
export const api_brush_shipments = function(order_id,data){
    return http(Url2(url_brush_shipments,{order_id:order_id}),data);
};
//获取刷单订单列表 brush-orders
export const url_brush_orders_list = "get|brush-orders";
export const api_brush_orders_list = function(data){
    return http(url_brush_orders_list,data);
};
//获取物流商 shipping-method/list-order
export const url_shipping_method = "get|shipping-method/list-order";
export const api_shipping_method = function(){
    return http(url_shipping_method);
};
//获取发货状态
export const url_delivery_type = "get|orders/deliveryType/info";
export const api_delivery_type = function(){
    return http(url_delivery_type)
};
//系统订单导出orders/export
export const url_orders_export = "post|orders/export";
export const api_orders_export = function(data,head){
    return http(url_orders_export,data,head)
};
// 取消上传仓库
export const url_cancel_push = "post|orders/cancel-push";
export const api_cancel_push = function (data) {
    return http(url_cancel_push,data);
};
//取消物流
export const url_cancel_logistics = "post|orders/cancel-logistics";
export const api_cancel_logistics = function (data) {
    return http(url_cancel_logistics,data);
};
//增加sku备注
export const url_set_note = "post|orders/:order_id/:sku_id/note";
export const api_set_note = function (order_id,sku_id,data) {
    return http(Url2(url_set_note,{order_id:order_id,sku_id:sku_id}),data);
};
//重新跑规则
export const url_again_running_rule = "post|orders/again-running-rule";
export const api_again_running_rule = function (data) {
    return http(url_again_running_rule,data);
};
//更改运输方式
export const url_update_shipping = "post|orders/update-shipping";
export const api_update_shipping = function (data) {
    return http(url_update_shipping,data);
};
//批量新增订单备注
export const url_batch_remark = "post|orders/batch/remark";
export const api_batch_remark = function (data) {
    return http(url_batch_remark,data);
};
//批量作废订单
export const url_batch_invalid = "post|orders/batch/invalid";
export const api_batch_invalid = function (data) {
    return http(url_batch_invalid,data);
};
//重新获取货品成本
export const url_update_cost = "get|orders/:order_id/cost";
export const api_update_cost = function (order_id) {
    return http(Url2(url_update_cost,{order_id:order_id}));
};
//导入跟踪号
export const url_post_tracking = "post|orders/tracking/import";
export const api_post_tracking = function (data) {
    return http(Url2(url_post_tracking),data);
};
//获取当前sku的兄弟sku列表
export const url_get_sku_siblings = "get|goods-sku/:id/siblings";
export const api_get_sku_siblings = function (id) {
    return http(Url2(url_get_sku_siblings,{id:id}));
};
//获取导出选择字段,有多个页面共用
export const url_orders_export_title = "get|orders/export-title";
export const api_orders_export_title = function () {
    return http(Url2(url_orders_export_title));
};
//延长速卖通收货时间orders/4/delay-time
export const url_orders_day_address = "post|orders/:day/delay-time";
export const api_orders_day_address = function(day, data){
    return http(Url2(url_orders_day_address,{day:day}), data);
};
//缺货订单导出stock-orders/export
export const url_stock_orders_export = "post|stock-orders/export";
export const api_stock_orders_export = function(data,head){
    return http(url_stock_orders_export,data,head)
};

//缺货订单页面获取导出选择字段
export const url_stock_orders_export_title = "get|stock-orders/export-title";
export const api_stock_orders_export_title = function () {
    return http(Url2(url_stock_orders_export_title));
};
//批量修改仓库
export const url_orders_batch_change_warehouse = "post|orders/batch/change-warehouse";
export const api_orders_batch_change_warehouse = function(data,head){
    return http(url_orders_batch_change_warehouse,data,head)
};
//获取店铺list
export const url_get_orders_shop = "get|orders/shop";
export const api_get_orders_shop = function (data) {
    return http(url_get_orders_shop,data);
};
//虚拟订单导出
export const url_brush_orders_export = "post|brush-orders/export";
export const api_brush_orders_export = function(data,head){
    return http(url_brush_orders_export,data,head)
};
//获取ebay买家物流
export const url_get_ebay_orders_shipping = "get|ebay-orders/shipping";
export const api_get_ebay_orders_shipping = function (data) {
    return http(url_get_ebay_orders_shipping,data);
};
//发送invoice给买家
export const url_orders_send_invoice = "post|orders/send-invoice";
export const api_orders_send_invoice = function(data,head){
    return http(url_orders_send_invoice,data,head)
};
//加入人工审核
export const url_orders_batch_review = "post|orders/batch-review";
export const api_orders_batch_review = function(data,head){
    return http(url_orders_batch_review,data,head)
};
//获取操作人部门
export const url_get_user_id_get_department = "get|user/:id/get-department";
export const api_get_user_id_get_department = function (id) {
    return http(Url2(url_get_user_id_get_department,{id}));
};
//重新退款
export const url_orders_order_renew_refund = "post|orders/order-renew-refund";
export const api_orders_order_renew_refund = function (data) {
    return http(url_orders_order_renew_refund,data);
};
//标记已退款
export const url_mark_refund_failed = "post|orders/mark-refund-failed";
export const api_mark_refund_failed = function (data) {
    return http(url_mark_refund_failed,data);
};
