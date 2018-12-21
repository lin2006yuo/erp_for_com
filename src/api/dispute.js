/**
 * Created by RondaFul on 2017/4/20.
 */
import {http} from '../lib/http-plus';
//速卖通纠纷
export const url_get_account = "get|orders/account";
export const api_get_account = function (data) {
    return http(url_get_account,data)
};
//查看速卖通纠纷
export const url_get_ali_issue_id = "get|ali-issue/:id";
export const api_get_ali_issue_id = function (id) {
    return http(Url2(url_get_ali_issue_id, {id:id}))
};
//同意买家方案
export const url_ali_issue_agree_solution = "post|ali-issue/agree-solution";
export const api_ali_issue_agree_solution = function (data) {
    return http(url_ali_issue_agree_solution,data)
};
//获取纠纷历史
export const url_ali_issue_get_process_id = "get|ali-issue/get-process/:id";
export const api_ali_issue_get_process_id = function (id) {
    return http(Url2(url_ali_issue_get_process_id, {id:id}))
};
//新增并拒绝方案
export const url_post_ali_issue_add_solution = "post|ali-issue/add-solution";
export const api_post_ali_issue_add_solution = function (data) {
    return http(url_post_ali_issue_add_solution,data)
};
//编辑卖家方案
export const url_post_ali_issue_edit_solution = "post|ali-issue/edit-solution";
export const api_post_ali_issue_edit_solution = function (data) {
    return http(url_post_ali_issue_edit_solution,data)
};
//上传证据图片
export const url_post_ali_issue_upload_images = "post|ali-issue/upload-images";
export const api_post_ali_issue_upload_images = function (data) {
    return http(url_post_ali_issue_upload_images,data)
};
//获取退货寄回地址
export const url_ali_issue_get_refund_address_id = "get|ali-issue/get-refund-address/:id";
export const api_ali_issue_get_refund_address_id = function (id) {
    return http(Url2(url_ali_issue_get_refund_address_id, {id:id}))
};
export const url_get_list = "get|ali-issue";
export const api_get_list = function (data) {
    return http(Url2(url_get_list),data);
};
export const url_get_issue = "get|ali-issue/:id";
export const api_get_issue = function (id) {
    return http(Url2(url_get_issue, {id:id}));
};
//ebay纠纷
// 获取纠纷列表
export const url_ebay_dispute = "get|ebay-dispute";
export const api_ebay_dispute = function (data) {
    return http(url_ebay_dispute,data)
};
//纠纷类型列表
export const url_msg_dispute_types ="get|ebay-dispute/types";
export const api_dispute_types = function () {
    return http(url_msg_dispute_types)
};
// 纠纷状态列表
export const url_dispute_status = "get|ebay-dispute/status";
export const api_dispute_status = function (data) {
    return http(url_dispute_status,data)
};
// 获取搜索字段键值数组
export const url_dispute_search = "get|ebay-dispute/search/fields";
export const api_dispute_search = function (data) {
    return http(url_dispute_search,data)
};
//纠纷类型对应的ID描述
export const url_dispute_typeIds = "get|ebay-dispute/typeIds";
export const api_dispute_typeIds = function (data) {
    return http(url_dispute_typeIds,data)
};
//查看
export const url_dispute_look = "get|ebay-dispute/:id";
export const api_dispute_look = function (id,data) {
    return http(Url2(url_dispute_look,{id:id}),data)
};
//取消订单纠纷-相关操作
export const url_dispute_cancel = "post|ebay-dispute/operate/cancel";
export const api_dispute_cancel = function (data) {
    return http(url_dispute_cancel,data)
};
//未收到货纠纷-相关操作
export const url_dispute_inquiry = "post|ebay-dispute/operate/inquiry";
export const api_dispute_inquiry = function (data) {
    return http(url_dispute_inquiry,data)
};
//退换货纠纷-相关操作
export const url_dispute_return = "post|ebay-dispute/operate/return";
export const api_dispute_return = function (data) {
    return http(url_dispute_return,data)
};
//升级case纠纷-相关操作
export const url_dispute_case = "post|ebay-dispute/operate/case";
export const api_dispute_case = function (data) {
    return http(url_dispute_case,data)
};
//更新
export const url_dispute_update = "put|ebay-dispute/:id";
export const api_dispute_update = function (id,data) {
    return http(Url2(url_dispute_update,{id:id}),data)
};

//批量更新
export const url_batch_dispute_update = "put|ebay-dispute/batch-update";
export const api_batch_dispute_update = function (data) {
    return http(url_batch_dispute_update,data)
};

//升级 原因 下拉框数据
export const url_dispute_reasons = "get|ebay-dispute/reasons";
export const api_dispute_reasons = function (data) {
  return http(url_dispute_reasons,data)
};
//获取纠纷状态
export const url_ali_issue_get_label = "get|ali-issue/get-label";
export const api_ali_issue_get_label = function (data) {
    return http(url_ali_issue_get_label, data);
};
//批量更改为待定
export const url_post_aliexpress_order_undetermined = "post|aliexpress-order/undetermined";
export const api_post_aliexpress_order_undetermined = function(data){
    return http(url_post_aliexpress_order_undetermined,data)
};
//Shopee纠纷
// 获取纠纷列表
export const url_shopee_dispute = "get|shopee-dispute";
export const api_shopee_dispute = function (data) {
    return http(url_shopee_dispute,data)
};
//退款申请详情
export const url_shopee_look_return = "get|shopee-dispute/return/:returnsn";
export const api_shopee_look_return = function (returnsn,data) {
    return http(Url2(url_shopee_look_return,{returnsn:returnsn}),data)
};
//订单取消申请详情
export const url_shopee_look_cancel = "get|shopee-dispute/cancel/:ordersn";
export const api_shopee_look_cancel = function (ordersn,data) {
    return http(Url2(url_shopee_look_cancel,{ordersn:ordersn}),data)
};
//接受取消订单申请
export const url_accept_cancel_order = "put|shopee-dispute/:ordersn/accept";
export const api_accept_cancel_order = function (ordersn,data) {
    return http(Url2(url_accept_cancel_order,{ordersn:ordersn}),data)
};
//拒绝取消订单申请
export const url_reject_cancel_order = "put|shopee-dispute/:ordersn/reject";
export const api_reject_cancel_order = function (ordersn,data) {
    return http(Url2(url_reject_cancel_order,{ordersn:ordersn}),data)
};
//获取卖家争议理由
export const url_get_seller_reason = "get|shopee-dispute/:returnsn/dispute";
export const api_get_seller_reason = function (returnsn,data) {
    return http(Url2(url_get_seller_reason,{returnsn:returnsn}),data)
};
//获取shopee纠纷日志--退货退款
export const url_get_shopee_log = "get|shopee-dispute/:returnsn/log";
export const api_get_shopee_log = function (returnsn,data) {
    return http(Url2(url_get_shopee_log,{returnsn:returnsn}),data)
};
//获取shopee纠纷日志--订单取消
export const url_get_shopee_order_cancel_log = "get|shopee-dispute/:ordersn/log";
export const api_get_shopee_order_cancel_log = function (ordersn,data) {
    return http(Url2(url_get_shopee_order_cancel_log,{ordersn:ordersn}),data)
};
//向shopee提出争议
export const url_post_dispute = "post|shopee-dispute/:returnsn/dispute";
export const api_post_dispute = function (returnsn, data) {
    return http(Url2(url_post_dispute,{returnsn:returnsn}),data)
};
//获取退货状态列表
export const url_shopee_return_state = "get|shopee-dispute/return/group-count";
export const api_shopee_return_state = function () {
    return http(url_shopee_return_state)
};
//获取订单取消状态列表
export const url_shopee_cancel_state = "get|shopee-dispute/cancel/group-count";
export const api_shopee_cancel_state = function () {
    return http(url_shopee_cancel_state)
};
//刷新订单退货数据
export const url_shopee_return_refresh = "post|shopee-dispute/return/refresh";
export const api_shopee_return_refresh = function (data) {
    return http(url_shopee_return_refresh,data)
};
//刷新订单取消数据
export const url_shopee_cancel_refresh = "post|shopee-dispute/cancel/refresh";
export const api_shopee_cancel_refresh = function (data) {
    return http(url_shopee_cancel_refresh,data)
};
//获取速卖通纠纷站内信
export const url_aliexpress_msg_order_order_on = "get|aliexpress-msg/order/:id";
export const api_aliexpress_msg_order_order_on = function (id) {
    return http(Url2(url_aliexpress_msg_order_order_on,{id}))
};
//发送站内信
export const url_aliexpress_msg_add_msg = "post|aliexpress-msg/add-msg";
export const api_aliexpress_msg_add_msg = function (data) {
    return http(url_aliexpress_msg_add_msg,data)
};
