/**
 * Created by RondaFul on 2017/3/9.
 */
import {http} from '../lib/http-plus';

//获取采购员
export const url_publish_edit_user = "get|user/buyer/staffs";
export const publish_edit_user = function(){
  return http(url_publish_edit_user)
};

//获取供应商
export const url_publish_edit_supplier = "get|supplier";
export const publish_edit_supplier = function(){
  return http(url_publish_edit_supplier)
};

//获取列表
export const url_finance_list = "get|finance-purchase";
export const api_finance_list = function(data){
  return http(url_finance_list,data)
};
//付款
export const url_finance_pay = "post|finance-purchase/batchChangeStatus";
export const api_finance_pay = function(data){
  return http(url_finance_pay,data)
};
//付款s
export const url_cancel_pay = "post|finance-purchase/batchChangeStatus";
export const api_cancel_pay = function(data){
    return http(url_cancel_pay,data)
};
//采购结算导出finance-purchase/export
export const url_finance_purchase_export = "post|finance-purchase/export";
export const api_finance_purchase_export = function(data){
    return http(url_finance_purchase_export,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:120000
    })
};
//付款申请导出purchase-apply/export
export const url_purchase_apply_export = "post|purchase-apply/export";
export const api_purchase_apply_export = function(data){
    return http(url_purchase_apply_export,data,{
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    })
};
//查看状态
export const url_purchase_look_apply = "get|purchase-apply/:id";
export const api_purchase_look_apply = function(id){
    return http(Url2(url_purchase_look_apply,{id:id}));
};
//处理状态
export const url_purchase_edit_apply = "get|purchase-apply/:id/edit";
export const api_purchase_edit_apply = function(id){
    return http(Url2(url_purchase_edit_apply,{id:id}));
};
//采购审核通过或不通过虚拟付款申请
export const url_purchase_audit_purchaser = "post|purchase-apply/audit-purchaser";
export const api_purchase_audit_purchaser = function(data){
    return http(url_purchase_audit_purchaser,data);
};
//财务审核通过或不通过虚拟付款申请
export const url_purchase_apply_audit = "post|purchase-apply/audit-finance";
export const api_purchase_apply_audit = function(data){
    return http(url_purchase_apply_audit,data);
};
//财务复核通过或不通过虚拟付款申请
export const url_purchase_apply_audit2 = "post|purchase-apply/audit-finance2";
export const api_purchase_apply_audit2 = function(data){
    return http(url_purchase_apply_audit2,data);
};
//标记已付款虚拟付款申请
export const url_purchase_apply_mark_payed = "post|purchase-apply/mark-payed";
export const api_purchase_apply_mark_payed = function(data){
    return http(url_purchase_apply_mark_payed,data);
};
//取消付款申请
export const url_purchase_apply_cancel = "post|purchase-apply/cancel";
export const api_purchase_apply_cancel = function(data){
    return http(url_purchase_apply_cancel,data);
};
//作废付款申请
export const url_purchase_apply_invalid = "post|purchase-apply/invalid";
export const api_purchase_apply_invalid = function(data){
    return http(url_purchase_apply_invalid,data);
};
//提交作废付款申请
export const url_purchase_apply_processor = "put|purchase-apply/:id";
export const api_purchase_apply_processor = function(id,data){
    return http(Url2(url_purchase_apply_processor,{id:id}),data);
};
//计算付款总金额和USD
export const url_calculating_money = "post|purchase-apply/calculating-money";
export const api_calculating_money = function (data) {
    return http(url_calculating_money,data);
};
//导出至富友
export const url_purchase_export_fuyou = "post|purchase-apply/export-fuyou";
export const api_purchase_export_fuyou = function (data) {
    return http(url_purchase_export_fuyou,data);
};
//批量修改结算方式
export const url_purchase_apply_balance_type = "put|purchase-apply/balance-type";
export const api_purchase_apply_balance_type = function(data) {
    return http(url_purchase_apply_balance_type, data);
};
// 获取我的模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
//获取导出模板purchase-plan/export-fields
export const url_purchase_apply_export_fields = "get|purchase-apply/export-fields";
export const api_purchase_apply_export_fields = function(data) {
    return http(Url2(url_purchase_apply_export_fields), data);
};
//获取付款申请日志接口
export const url_purchase_operation_log = "get|purchase-apply/:id/log";
export const api_purchase_operation_log = function (ids,data) {
    return http(Url2(url_purchase_operation_log,{id:ids}), data);
};
//上传发票
export const url_purchase_apply_upload_images = "post|purchase-apply/upload-images";
export const api_purchase_apply_upload_images = function(data){
    return http(url_purchase_apply_upload_images,data);
};
//导出发票
export const url_purchase_apply_down_invoice = "get|purchase-apply/down-invoice/:id";
export const api_purchase_apply_down_invoice = function(id) {
    return http (Url2(url_purchase_apply_down_invoice, {id:id}));
};
//上传付款回单
export const url_purchase_apply_upload_payment_images = "post|purchase-apply/upload-payment-images";
export const api_purchase_apply_upload_payment_images = function(data) {
    return http(url_purchase_apply_upload_payment_images, data);
};
//批量返回上一步状态
export const url_purchase_apply_return_mark_payed = "put|purchase-apply/return-mark-payed";
export const api_purchase_apply_return_mark_payed = function(data) {
    return http(url_purchase_apply_return_mark_payed, data);
};
//批量上传付款回单
export const url_purchase_apply_upload_batch_payment_images = "post|purchase-apply/batch-upload-payment-images";
export const api_purchase_apply_upload_batch_payment_images = function(data) {
    return http(url_purchase_apply_upload_batch_payment_images, data);
};
//获取1688url 付款链接
export const url_purchase_online_payment = "post|ali1688payment/online-payment";
export const api_purchase_online_payment = function(data) {
    return http(url_purchase_online_payment, data);
};
//1688支付方式下拉框
export const url_get_ali_pay_type = "get|ali1688payment/pay-type";
export const api_get_ali_pay_type = function (data) {
    return http(Url2(url_get_ali_pay_type), data)
};
//1688支付完成
export const url_purchase_ali_payment = "post|ali1688payment/get-order-details";
export const api_purchase_ali_payment = function(data) {
    return http(url_purchase_ali_payment, data);
};
