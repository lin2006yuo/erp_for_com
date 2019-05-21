/**
 * Created by Administrator on 2017/6/12.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

//获取异常类型
export const url_purchase_parcels_abnormal_type = "get|purchase-parcels/abnormal-type";
export const api_purchase_parcels_abnormal_type = function (params) {
    return http(url_purchase_parcels_abnormal_type, params);
};
//长时间未拆列表
export const url_purchase_order_long_time = "get|purchase-order/long-time";
export const api_purchase_order_long_time = function (params) {
    return http(url_purchase_order_long_time, params);
};
//查看其他异常信息
export const url_get_purchase_order_abnormal_abnormal_id = "get|purchase-order/abnormal/:abnormal_id";
export const api_get_purchase_order_abnormal_abnormal_id = function (abnormal_id,params) {
    return http(Url2(url_get_purchase_order_abnormal_abnormal_id,{abnormal_id}), params);
};
//查看包裹丢失信息
export const url_get_purchase_order_abnormal_id_lost = "get|purchase-order/:abnormal_id/lost";
export const api_get_purchase_order_abnormal_id_lost = function (abnormal_id,params) {
    return http(Url2(url_get_purchase_order_abnormal_id_lost,{abnormal_id}), params);
};
//保存或提交丢失信息
export const url_put_purchase_order_abnormal_id_lost = "put|purchase-order/:abnormal_id/lost";
export const api_put_purchase_order_abnormal_id_lost = function (abnormal_id,params) {
    return http(Url2(url_put_purchase_order_abnormal_id_lost,{abnormal_id}), params);
};
//组长审批或退回修改
export const url_put_purchase_order_abnormal_id_review_leader = "put|purchase-order/:abnormal_id/review-leader";
export const api_put_purchase_order_abnormal_id_review_leader = function (abnormal_id,params) {
    return http(Url2(url_put_purchase_order_abnormal_id_review_leader,{abnormal_id}), params);
};
//经理审核或退回修改
export const url_put_purchase_order_abnormal_id_review_manager = "put|purchase-order/:abnormal_id/review-manager";
export const api_put_purchase_order_abnormal_id_review_manager = function (abnormal_id,params) {
    return http(Url2(url_put_purchase_order_abnormal_id_review_manager,{abnormal_id}), params);
};
//结束有差异包裹
export const url_put_purchase_order_abnormal_id_end_difference_parcel = "put|purchase-order/:abnormal_id/end-difference-parcel";
export const api_put_purchase_order_abnormal_id_end_difference_parcel = function (abnormal_id,params) {
    return http(Url2(url_put_purchase_order_abnormal_id_end_difference_parcel,{abnormal_id}), params);
};
//获取审批状态buttons
export const url_purchase_order_audit_status_text = "get|purchase-order/audit-status-text";
export const api_purchase_order_audit_status_text = function (params) {
    return http(url_purchase_order_audit_status_text, params);
};
