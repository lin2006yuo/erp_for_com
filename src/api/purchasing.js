/**
 * Created by RondaFul on 2017/1/13.
 */
import {http} from '../lib/http-plus';

export const url_purchasing_getWarehouseChannel = "get|delivery/getWarehouseChannel";
export const getWarehouseChannel = function() {
  return http(Url2(url_purchasing_getWarehouseChannel));
};

//新建入库/出库单仓库列表
export const url_stock_in_out_warehouse = "get|warehouse/info";
export const api_stock_in_out_warehouse = function (data) {
    return http(url_stock_in_out_warehouse, data);
};
export const url_purchasing_getUser = "get|user/purchase/staffs";
export const getUser = function() {
    return http(Url2(url_purchasing_getUser));
};
export const url_purchasing_getSupplier ="get|supplier-offer/supplier";
export const getSupplier = function(data) {
    return http(Url2(url_purchasing_getSupplier),data);
};
export const url_purchasing_list = "get|purchase-proposal";
export const purchasing_list = function(data) {
    return http(url_purchasing_list,data,{contentType:'application/x-www-form-urlencoded', timeout:180000});
};
export const url_purchasing_update = "put|purchase-proposal/:id";
export const purchasing_update = function(id,data) {
    return http(Url2(url_purchasing_update,{id:id}),data);
};
export const url_purchasing_add = "post|purchase-proposal";
export const purchasing_add = function(data) {
    return http(Url2(url_purchasing_add),data);
};
export const url_purchasing_plan = "post|purchase-proposal/createPurchasePlan";
export const purchasing_plan = function(data) {
    return http(Url2(url_purchasing_plan),data);
};
//重启生成状态
export const url_reset_proposal_status = "post|purchase-proposal/resetProposalStatus";
export const reset_proposal_status = function(data) {
    return http(Url2(url_reset_proposal_status),data);
};
//采购建议 计算
export const url_purchasing_cal = "post|purchase-proposal/calculatePurchaseProposal";
export const api_purchasing_cal = function(data) {
    return http(Url2(url_purchasing_cal),data);
};
//备货建议列表
export const url_get_stocking_advice = "get|stocking-advice";
export const api_get_stocking_advice = function(data) {
    return http(Url2(url_get_stocking_advice),data);
};
//获取状态/
export const url_stocking_advice_status = "get|stocking-advice/status";
export const api_stocking_advice_status = function(data) {
    return http(Url2(url_stocking_advice_status),data);
};
//生成采购时间
export const url_purchasing_caltime = "get|purchase-proposal/lastPurchaseProposal";
export const api_purchasing_caltime = function(data) {
    return http(Url2(url_purchasing_caltime),data);
};
/*查看供应商报价*/
export const url_purchasing_currency = "get|purchase-proposal/getSupplier";
export const api_purchasing_currency = function(data) {
    return http(Url2(url_purchasing_currency),data);
};
//通过id获取备货建议详情
export const url_stocking_advice = "get|stocking-advice/:id";
export const api_stocking_advice = function(id,data) {
    return http(Url2(url_stocking_advice,{id:id}),data);
};
// 获取分配详情
export const url_distribution_details = "get|stocking-advice/:id/distribution-details";
export const api_distribution_details = function(id,data) {
    return http(Url2(url_distribution_details,{id:id}),data);
};
//开发审核
export const url_develop_review = "put|stocking-advice/develop-review";
export const api_develop_review = function(data) {
    return http(Url2(url_develop_review),data);
};
//开发批量审批
export const url_batch_develop_review = "put|stocking-advice/batch-develop-review";
export const api_batch_develop_review = function(data) {
    return http(Url2(url_batch_develop_review),data);
};
//驳回
export const url_batch_develop_rejecet = "put|stocking-advice/batch-develop-reject";
export const api_batch_develop_rejecet = function(data) {
    return http(Url2(url_batch_develop_rejecet),data);
};
// 批量处理http://api.rondaful.com/stocking-advice/develop-processing-plan
export const url_stocking_advice_develop_processing_plan = "put|stocking-advice/develop-processing-plan";
export const api_stocking_advice_develop_processing_plan = function(data) {
    return http(Url2(url_stocking_advice_develop_processing_plan),data);
};
//获取备货计划导出列表
export const url_export_title = "get|stocking-advice/export-title";
export const api_export_title = function(data) {
    return http(Url2(url_export_title),data);
};
//备货计划导出
export const url_stocking_advice_export = "post|stocking-advice/export";
export const api_stocking_advice_export = function(data,head) {
    return http(url_stocking_advice_export,data,head);
};
//获取SKU图表数据
export const url_chart_data = "get|purchase-proposal/chart-data";
export const api_chart_data = function(data) {
    return http(Url2(url_chart_data),data);
};
//保存采购计划数据
export const url_updata_proposal_arg = "post|purchase-proposal/updateProposalArgs";
export const api_updata_proposal_arg = function(data) {
    return http(Url2(url_updata_proposal_arg),data);
};
//生成采购计划之前的-保存采购计划数据
export const url_updata_before_create_plan = "post|purchase-proposal/updateProposalArgsBeforeCreatePlan";
export const api_updata_before_create_plan = function(data) {
    return http(Url2(url_updata_before_create_plan),data);
};
//获取各个仓库最低报价的交期
export const url_supplier_delivery = "get|/supplier/delivery";
export const api_supplier_delivery = function(data) {
    return http(Url2(url_supplier_delivery),data);
};
//导出采购建议
export const url_purchaseing_export = "post|purchase-proposal/export";
export const api_purchaseing_export = function(data) {
    return http(url_purchaseing_export,data);
};
//获取sku状态goods/sales-status
export const url_goods_sales_status = "get|goods/sales-status";
export const api_goods_sales_status = function() {
    return http(Url2(url_goods_sales_status));
};
//中转仓
export const url_warehous_transit = "get|warehouse/transit";
export const api_warehous_transit = function () {
    return http(url_warehous_transit);
};
//删除采购计划
export const url_purchase_proposal_delete = "post|purchase-proposal/delete";
export const api_purchase_proposal_delete = function(data) {
    return http(Url2(url_purchase_proposal_delete),data);
};
//获取采购员
export const url_get_user_proposal_staffs = "get|user/proposal/staffs";
export const api_get_user_proposal_staffs = function() {
    return http(url_get_user_proposal_staffs);
};
