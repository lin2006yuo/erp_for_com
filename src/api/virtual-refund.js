import {http} from '../lib/http-plus';

//返款申请列表
export const url_get_virtual_refund_list = "get|virtual-refund";
export const api_get_virtual_refund_list = function (data) {
    return http(url_get_virtual_refund_list, data);
};

//查看返款申请单
export const url_get_virtual_refund_form = "get|virtual-refund/:id";
export const api_get_virtual_refund_form = function (id,data) {
    return http(Url2(url_get_virtual_refund_form, {id:id}), data);
};

//单个审批
export const url_post_single_approval_refund = "post|virtual-refund/approval";
export const api_post_single_approval_refund = function (data) {
    return http(url_post_single_approval_refund, data);
};

//批量审批
export const url_post_batch_approval_refund = "post|virtual-refund/batch/approval";
export const api_post_batch_approval_refund = function (data) {
    return http(url_post_batch_approval_refund, data);
};

//批量标记返款状态
export const url_post_batch_refund_status = "post|virtual-refund/batch/refund";
export const api_post_batch_refund_status = function (data) {
    return http(url_post_batch_refund_status, data);
};

//获取execl字段
export const url_get_title = "get|virtual-refund/export-title";
export const api_get_title = function (data) {
    return http(url_get_title, data);
};
//导出execl字段
export const url_export_title = "post|virtual-refund/export";
export const api_export_title = function (data, head) {
    return http(url_export_title, data, head);
};
// 获取我的模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};