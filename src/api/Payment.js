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
