/**
 * Created by RondaFul on 2017/1/13.
 */
import {http} from '../lib/http-plus';

export const url_purchasing_getWarehouseChannel = "get|delivery/getWarehouseChannel";
export const getWarehouseChannel = function() {
  return http(Url2(url_purchasing_getWarehouseChannel));
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
