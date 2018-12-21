/**
 * Created by RondaFul on 2017/1/13.
 */
import {http} from '../lib/http-plus';
//获取仓库
export const url_publish_edit_depot= "get|delivery/getWarehouseChannel";
export const publish_edit_depot  = function() {
    return http(Url2(url_publish_edit_depot));
};
//获取采购员
export const url_publish_edit_user= "get|user/purchase/staffs";
export const publish_edit_user  = function() {
    return http(Url2(url_publish_edit_user));
};
//获取供应商
export const url_publish_edit_supplier= "get|supplier-offer/supplier";
export const publish_edit_supplier  = function() {
    return http(Url2(url_publish_edit_supplier));
};
//获取物流
export const url_publish_edit_carrier= "get|warehouse/getShip";
export const publish_edit_carrier  = function(data) {
    return http(Url2(url_publish_edit_carrier),data);
};

//采购订单列表
export const url_publish_carrier_list= "get|purchase-order";
export const api_publish_edit_carrier  = function(data) {
    return http(Url2(url_publish_carrier_list),data);
};
//添加采购单
export const url_publish_add_pur= "post|purchase-order";
export const api_publish_add_pur  = function(data) {
    return http(Url2(url_publish_add_pur),data);
};
//获取SKU 信息
export const url_publish_add_sku= "get|purchase-order/getSkuInfo";
export const api_publish_add_sku  = function(data) {
    return http(Url2(url_publish_add_sku),data);
};
//查看状态
export const url_publish_look_detail = "get|purchase-order/:id";
export const api_look_detail  = function(id) {
    return http(Url2(url_publish_look_detail , {id:id}));
};
//查看状态下  sku
export const url_publish_look_sku= "get|purchase-order/getDetail";
export const api_publish_look_sku  = function(data) {
    return http(Url2(url_publish_look_sku),data);
};
//编辑状态下
export const url_publish_edit_detail = "get|purchase-order/:id/edit";
export const api_edit_detail  = function(id) {
    return http(Url2(url_publish_edit_detail , {id:id}));
};
//操作日记
export const url_publish_log = "get|purchase-order/getLogDetail";
export const api_log_detail  = function(data) {
    return http(Url2(url_publish_log), data);
};
//保存
export const url_publish_update_detail = "put|purchase-order/:id";
export const api_update_detail  = function(id,data) {
    return http(Url2(url_publish_update_detail , {id:id}),data);
};

//保存物流信息
export const url_publish_update_logistics = "put|purchase-order/logistics/:id";
export const api_update_logistics  = function(id,data) {
    return http(Url2(url_publish_update_logistics , {id:id}),data);
};
//作废
export const url_cancel = "post|purchase-order/changeStatus";
export const api_cancel  = function(data) {
    return http(Url2(url_cancel), data);
};
//作废申请
export const url_invalid = "put|purchase-order/:id/invalid";
export const api_invalid  = function(id,data) {
    return http(Url2(url_invalid, {id:id}), data);
};
//批量付款
export const url_gain_pay = "get|purchase-order/applyPayment";
export const api_gain_pay = function(data) {
    return http(Url2(url_gain_pay), data);
};
//获取批量付款
export const url_pay = "post|purchase-order/batchApplyPayment";
export const api_pay = function(data) {
    return http(Url2(url_pay), data);
};
//添加备注
export const url_add_mark = "post|purchase-order/remarks";
export const api_add_mark = function(data) {
    return http(Url2(url_add_mark), data);
};
/*查看供应商报价*/
//TODO:api优化为纯小写字母
export const url_getSupplier = "get|purchase-proposal/getSupplier";
export const api_getSupplier = function(data) {
    return http(Url2(url_getSupplier),data);
};
//到货列表
export const url_purchase_arrival = "get|/Purchase/PurchaseArrival/orderDetail";
export const api_purchase_arrival = function(data) {
    return http(url_purchase_arrival,data);
};
//到货
export const url_purchase_arrival_sub = "post|/Purchase/PurchaseArrival/arrival";
export const api_purchase_arrival_sub = function(data) {
    return http(Url2(url_purchase_arrival_sub),data);
};

//通过sku_id找到sku
export const url_get_sku = "get|/orders/getGoods";
export const api_get_sku = function (data) {
  return http(Url2(url_get_sku),data);
};

//获取采购单记录
export const get_purchase_record = "get|purchase-order/:id";
export const api_get_purchase_record  = function(id) {
    return http(Url2(get_purchase_record,{id:id}));
};

//同意审核
export const not_waiting = "post|purchase-order/purchaseNotWaitingAudit";
export const api_not_waiting  = function(data) {
    return http(Url2(not_waiting), data);
};

//到货记录sku
export const url_record_look_sku = "get|purchase-order/getArrivalRecords";
export const api_record_look_sku  = function(data) {
    return http(Url2(url_record_look_sku),data);
};

//获取网络下单运单号
export const url_get_tracking_number = "get|/purchase-order/getTraceInformation";
export const api_get_tracking_number = function(data) {
    return http(url_get_tracking_number, data);
};

//批量获取网络下单 运单号
export const url_get_tracking_numbers = "get|/purchase-order/getTraceInformationBatch";
export const api_get_tracking_numbers = function(data) {
    return http(url_get_tracking_numbers, data);
};

//新建采购单物流信息
export const url_purchase_order_logistics = "post|/purchase-order-logistics";
export const api_purchase_order_logistics = function(data) {
    return http(url_purchase_order_logistics, data);
};
//导出采购订单
export const url_purchase_export = "post|purchase-order/export";
export const api_purchase_export = function(data) {
    return http(url_purchase_export, data);
};
//采购单不等待剩余记录
export const url_get_records = "get|purchase-order/records/defective";
export const api_get_records = function(data) {
    return http(url_get_records, data);
};
//批量修改状态为等待到货
export const url_batch_status = "post|purchase-order/batch/status";
export const api_batch_status = function(data) {
    return http(url_batch_status, data);
};
//根据采购单id获取物流
export const url_get_logistics = "get|purchase-order/get-logistics";
export const api_get_logistics = function(data) {
    return http(Url2(url_get_logistics), data);
};
//批量审批不等待剩余
export const url_change_states = "put|purchase-order/status";
export const api_change_states = function(data) {
    return http(url_change_states, data);
};
//导入采购单
export const url_import_order = "post|purchase-order/import";
export const api_import_order = function(data) {
    return http(url_import_order, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: 90000
    });
};
//查看物流跟踪信息
export const url_logistics_detail = "get|purchase-order/:external_number/logisticsTraceInfos";
export const api_logistics_detail  = function(external_number) {
    return http(Url2(url_logistics_detail , {external_number:external_number}));
};
//修改备注信息
export const url_purchase_order_remarks = "post|purchase-order/:id/remarks";
export const api_purchase_order_remarks  = function(id,data) {
    return http(Url2(url_purchase_order_remarks , {id:id}),data);
};
//批量作废退回采购单 purchase-order/batchInvalid
export const url_purchase_order_batchInvalid = "post|purchase-order/batchInvalid";
export const api_purchase_order_batchInvalid = function(data) {
    return http(url_purchase_order_batchInvalid, data);
};
//申请作废purchase-order/:id/invalidApply
export const url_purchase_order_id_invalidApply = "put|purchase-order/:id/invalidApply";
export const api_purchase_order_id_invalidApply  = function(id,data) {
    return http(Url2(url_purchase_order_id_invalidApply , {id:id}),data);
};
// 获取可供选择的导出字段
export const url_purchase_order_export_fields = "get|purchase-order/export-fields";
export const api_purchase_order_export_fields = function (data) {
    return http(url_purchase_order_export_fields,data);
};
//确认到货
export const url_purchase_order_sure_arrival = "post|purchase-order/sure-arrival";
export const api_purchase_order_sure_arrival = function(data) {
    return http(url_purchase_order_sure_arrival, data);
};
//获取虚拟付款记录供应商
export const url_publish_virtual_supplier= "get|supplier/virtual-supplier";
export const publish_virtual_supplier  = function(data) {
    return http(url_publish_virtual_supplier, data)
};
//虚拟订单列表
export const url_publish_pay_list= "get|virtual-finance-purchase";
export const api_publish_edit_pay  = function(data) {
    return http(Url2(url_publish_pay_list),data);
};
//虚拟付款单审核状态
export const url_virtual_status = "get|virtual-finance-purchase/review-status";
export const api_virtual_status = function(data){
    return http(url_virtual_status,data);
};
//获取查看详情
export const url_log_read = "get|virtual-finance-purchase/:id";
export const api_log_read = function(id){
    return http(Url2(url_log_read,{id:id}));
};
//获取审批详情
export const url_log_audit = "get|virtual-finance-purchase/:id/review";
export const api_log_audit = function(id){
    return http(Url2(url_log_audit,{id:id}));
};
//审核通过或不通过虚拟付款
export const url_log_verify = "put|virtual-finance-purchase/:id/review";
export const api_log_verify = function(id,data){
    return http(Url2(url_log_verify,{id:id}),data);
};
//推送到有棵树
export const url_post_virtual_finance_purchase_push_yks = 'post|virtual-finance-purchase/push-yks';
export const api_post_virtual_finance_purchase_push_yks = function (data) {
    return http(url_post_virtual_finance_purchase_push_yks,data)
};
//虚拟导出字段
export const url_get_virtual_export_field = 'get|virtual-finance-purchase/export-fields';
export const api_get_virtual_export_field  = function (data) {
    return http(url_get_virtual_export_field,data)
};
//虚拟导出
export const url_get_virtual_export = 'post|virtual-finance-purchase/export';
export const api_get_virtual_export  = function (data,head) {
    return http(url_get_virtual_export,data,head)
};
// 获取我的模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
//计算虚拟付款记录的应付款总金额和已付款总金额
export const url_total_amount = "get|virtual-finance-purchase/total-amount";
export const api_total_amount = function (data) {
    return http(url_total_amount,data);
};
//导出虚拟订购单预览
export const url_read_purchase = "post|virtual-finance-purchase/read-purchase";
export const api_read_purchase = function (data) {
    return http(url_read_purchase,data);
};
//批量审核通过
export const url_batch_review = "put|virtual-finance-purchase/batch/review";
export const api_batch_review = function (data) {
    return http(url_batch_review,data);
};
//导出虚拟订购单
export const url_export_purchase = "post|virtual-finance-purchase/export-purchase";
export const api_export_purchase = function (data) {
    return http(url_export_purchase,data);
};
//导出虚拟收货单预览
export const url_read_receipt = "post|virtual-finance-purchase/read-receipt";
export const api_read_receipt = function (data) {
    return http(url_read_receipt,data);
};
//导出虚拟收货单
export const url_export_receipt = "post|virtual-finance-purchase/export-receipt";
export const api_export_receipt = function (data) {
    return http(url_export_receipt,data);
};
//导出虚拟入库单预览
export const url_read_stock = "post|virtual-finance-purchase/read-in-stock";
export const api_read_stock = function (data) {
    return http(url_read_stock,data);
};
//导出虚拟入库单
export const url_export_stock = "post|virtual-finance-purchase/export-in-stock";
export const api_export_stock = function (data) {
    return http(url_export_stock,data);
};
//导出虚拟送货单预览
export const url_read_deliver = "post|virtual-finance-purchase/read-deliver";
export const api_read_deliver = function (data) {
    return http(url_read_deliver,data);
};
//导出虚拟送货单
export const url_export_deliver = "post|virtual-finance-purchase/export-deliver";
export const api_export_deliver = function (data) {
    return http(url_export_deliver,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};
//导出虚拟发票预览
export const url_read_invoice = "post|virtual-finance-purchase/read-invoice";
export const api_read_invoice = function (data) {
    return http(url_read_invoice,data);
};
//导出虚拟发票
export const url_export_invoice = "post|virtual-finance-purchase/export-invoice";
export const api_export_invoice = function (data) {
    return http(url_export_invoice,data);
};
//获取采购单统计数据
export const url_purchase_order_calculating_money = "get|purchase-order/calculating-money";
export const api_purchase_order_calculating_money = function (data) {
    return http(url_purchase_order_calculating_money,data);
};






