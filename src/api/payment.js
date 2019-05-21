/**
 * Created by RondaFul on 2017/3/30.
 */
import {http} from '../lib/http-plus';
//获取采购员
export const url_publish_edit_user= "get|user/purchase/staffs";
export const publish_edit_user  = function() {
    return http(Url2(url_publish_edit_user));
};
//获取列表
export const url_finance_list= "get|purchase-apply";
export const api_finance_list  = function(data) {
    return http(Url2(url_finance_list),data);
};
//标记付款线上
export const url_finance_online_payment= "get|purchase-apply/online-payment-list";
export const api_finance_online_payment  = function(data) {
    return http(Url2(url_finance_online_payment),data);
};
//批量审核通过
export const url_finance_pay= "post|purchase-apply/batchChangeStatus";
export const api_finance_pay  = function(data) {
    return http(Url2(url_finance_pay),data);
};
//批量标记付款
export const url_finance_pay_apply= "post|finance-purchase/batchChangeStatus";
export const api_finance_pay_apply  = function(data) {
    return http(url_finance_pay_apply,data);
};
//获取付款状态
export const url_finance_status = "get|purchase-apply/status-label";
export const api_finance_status = function(data) {
    return http(url_finance_status, data);
};
//获取交易类型
export const url_supplier_transaction_info = "get|supplier/transaction/info";
export const api_supplier_transaction_info = function(data) {
    return http(url_supplier_transaction_info, data);
};
//获取供应链专员
export const url_get_supply_chain_department_id = "get|supplier/get-supply-chain-department-Id";
export const api_get_supply_chain_department_id = function () {
    return http(url_get_supply_chain_department_id);
};
//获取付款人
export const url_get_purchase_finance_id = "get|purchase-apply/get-finance-id";
export const api_get_purchase_finance_id = function () {
    return http(url_get_purchase_finance_id);
};
//获取1688账号
export const url_finance_ali_account = "get|ali1688Account/get-ali-account";
export const api_finance_ali_account = function(data) {
    return http(url_finance_ali_account, data);
};
