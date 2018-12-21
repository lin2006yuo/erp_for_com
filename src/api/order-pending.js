/**
 * Created by wuchuguang on 16-11-28.
 */

import {http} from '../lib/http-plus';

export const url_get = "get|orders-audit";
export const api_get = function (datas) {
    return http(Url2(url_get), datas);
};

export const url_platform2accout = "get|orders-audit/getChannelAccount";
export const api_platform2accout = function () {
    return http(Url2(url_platform2accout), {});
};

export const url_pending ="post|orders-audit/batch/:type";
export const api_pending = function (data) {
    return http(Url2(url_pending,{type:'pending'}),data);
};

export const url_preferred ="post|orders-audit/batch/:type";
export const api_preferred = function (data) {
    return http(Url2(url_preferred,{type:'preferred'}),data);
};

export const url_audited ="post|orders-audit/batch/:type";
export const api_audited = function (data) {
    return http(Url2(url_audited,{type:'audited'}),data);
};
//标记为联系退款/标记为联系买家
export const url_orders_audit_mark_link_status ="post|orders-audit/mark-link-status";
export const api_orders_audit_mark_link_status = function (data) {
    return http(url_orders_audit_mark_link_status,data);
};

//待审核订单状态列表
export const url_get_status ="get|orders-audit/status";
export const api_get_status = function () {
    return http(Url2(url_get_status), {});
};
//获得站点/账号
export const url_account_list ="get|orders/account";
export const api_account_list = function (datas) {
    return http(Url2(url_account_list), datas);
};
//获取平台
export const url_get_channel_categories ="get|orders/channel";
export const api_get_channel_categories = function () {
    return http(Url2(url_get_channel_categories), {});
};
//审核规则rules?type=3
export const url_get_rules = "get|rules";
export const api_get_rules = function (data) {
    return http(Url2(url_get_rules),data);
};
//问题订单导出，和系统订单导出一样的接口，但没写成共用
export const url_orders_audit_export = 'post|orders/export';
export const api_orders_audit_export = function(data,head){
    return http(url_orders_audit_export,data,head);
};
//获取原因类型
export const url_get_orders_audit_manual_review_status = "get|orders-audit/manual-review-status";
export const api_get_orders_audit_manual_review_status = function () {
    return http(url_get_orders_audit_manual_review_status);
};
