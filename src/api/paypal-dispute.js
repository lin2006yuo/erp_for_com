import {http} from '../lib/http-plus';

//paypal纠纷列表
export const url_get_paypal_dispute = "get|paypal-dispute";
export const api_get_paypal_dispute = function (data) {
    return http(url_get_paypal_dispute,data)
};

//paypal纠纷状态
export const url_get_paypal_status = "get|paypal-dispute/statistics";
export const api_get_paypal_status = function (data) {
    return http(url_get_paypal_status,data)
};

//paypal纠纷更新
export const url_paypal_dispute_update = "put|paypal-dispute/:id";
export const api__paypal_dispute_update = function (id,data) {
    return http(Url2(url_paypal_dispute_update,{id:id}),data)
};

//paypal纠纷账号筛选
export const url_get_paypal_account = "get|paypal-dispute/accounts";
export const api_get_paypal_account = function (data) {
    return http(url_get_paypal_account,data)
};

//paypal纠纷详情
export const url_paypal_dispute_details = "get|paypal-dispute/:id";
export const api_paypal_dispute_details = function (id,data) {
    return http(Url2(url_paypal_dispute_details,{id:id}),data)
};

//同意赔偿
export const url_post_accept_claim = "post|paypal-dispute/accept_claim";
export const api_post_accept_claim = function (data) {
    return http(url_post_accept_claim,data)
};

//paypal纠纷提议(stage=1或CHARGEBACK 客户回复说明不符时退款退换货)
export const url_post_make_offer = "post|paypal-dispute/make_offer";
export const api_post_make_offer = function (data) {
    return http(url_post_make_offer,data)
};

//paypal纠纷提供证据文件
export const url_post_provide_evidence = "post|paypal-dispute/provide_evidence";
export const api_post_provide_evidence = function (data) {
    return http(url_post_provide_evidence,data)
};

// paypal纠纷申诉-档案新增
export const url_post_appeal = "post|paypal-dispute/appeal";
export const api_post_appeal = function (data) {
    return http(url_post_appeal,data)
};

//paypal纠纷确认收到买家退货
export const url_post_acknowledge_return_item = "post|paypal-dispute/acknowledge_return_item";
export const api_post_acknowledge_return_item = function (data) {
    return http(url_post_acknowledge_return_item,data)
};

//paypal纠纷物流名称列表
export const url_get_paypal_carriers = "get|paypal-dispute/carriers";
export const api_get_paypal_carriers = function (data) {
    return http(url_get_paypal_carriers,data)
};

//paypal纠纷同意赔偿的原因
export const url_get_paypal_accept_reason = "get|paypal-dispute/accept_reason";
export const api_get_paypal_accept_reason = function (data) {
    return http(url_get_paypal_accept_reason,data)
};

//paypal纠纷拿给客户付款的订单
export const url_get_paypal_refund_order = "get|paypal-dispute/:id/refund_order";
export const api_get_paypal_refund_order = function (id, data) {
    return http(Url2(url_get_paypal_refund_order,{id: id}),data)
};

//paypal纠纷发送信息
export const url_post_send_message = "post|paypal-dispute/send_message";
export const api_post_send_message = function (data) {
    return http(url_post_send_message,data)
};

//paypal纠纷保存地址
export const url_post_add_address = "post|paypal-dispute/address";
export const api_post_add_address = function (data) {
    return http(url_post_add_address,data)
};

//paypal纠纷地址
export const url_get_paypal_address = "get|paypal-dispute/:aid/address";
export const api_get_paypal_address = function (aid, data) {
    return http(Url2(url_get_paypal_address,{aid: aid}),data)
};