import {http} from '../lib/http-plus';

export const url_get_list = "get|packages";
export const api_get_list = function (data) {
    return http(url_get_list, data);
};

//订单系统-物流异常包裹列表页面/providers-exception
export const url_get_providers_exception = "get|providers-exception";
export const api_get_providers_exception = function (data) {
    return http(url_get_providers_exception, data);
};

//打印面单号
export const url_post_print = "post|delivery-check/:package_id/print";
export const api_post_print = function (package_id, data) {
    return http(Url2(url_post_print, {package_id: package_id}), data);
};

//批量获取面单
export const url_get_packages = "post|packages/batch/label";
export const api_get_packages = function (data) {
    return http(url_get_packages, data);
};
//批量获取跟踪号
export const url_get_tracking = "post|packages/batch/tracking";
export const api_get_tracking = function (data) {
    return http(url_get_tracking, data);
};
//批量释放面单
export const url_free_packages = "post|placeorder/reback";
export const api_free_packages = function (data) {
    return http(url_free_packages, data);
};
//打印发票
export const url_print_invoice = "post|packages/print/invoice";
export const api_print_invoice = function (data) {
    return http(url_print_invoice, data);
};
//获取execl字段
export const url_get_title = "get|packages/export-title";
export const api_get_title = function (data) {
    return http(url_get_title, data);
};
//导出execl字段
export const url_export_title = "post|packages/export";
export const api_export_title = function (data, head) {
    return http(url_export_title, data, head);
};
//批量生成拣货单
export const url_batch_produce = "post|make-pickings/batch";
export const api_batch_produce = function (data) {
    return http(url_batch_produce, data);
};
//获取统计总数providers-exception/total
export const url_providers_exception_total = "get|providers-exception/total";
export const api_providers_exception_total = function () {
    return http(url_providers_exception_total);
};
//申请取消拣货单
export const url_apply_cancel = "post|packages/apply-cancel";
export const api_apply_cancel = function (data) {
    return http(url_apply_cancel, data)
};
//批量生成快速发货区拣货单
export const url_make_quick = "post|make-pickings/make-quick";
export const api_make_quick = function (data) {
    return http(url_make_quick, data)
};
//获取包裹是否缺货状态列表
export const url_oos_type = "get|packages/oos-type/info";
export const api_oos_type = function () {
    return http(url_oos_type);
};
//批量取消包裹物流
export const url_cancel_logistics = "post|packages/cancel-logistics";
export const api_cancel_logistics = function (data) {
    return http(url_cancel_logistics, data);
};
//批量拦截包裹
export const url_package_intercept = "post|packages/package-intercept";
export const api_package_intercept = function (data) {
    return http(url_package_intercept, data);
};
//zoodmall导出
export const url_zoodmall_export = "post|packages/zoodmall-export";
export const api_zoodmall_export = function (data) {
    return http(url_zoodmall_export, data);
};
//测试打印
export const url_test_print = "post|delivery-check/:package_id/test-print";
export const api_test_print = function (id, data) {
    return http(Url2(url_test_print, {package_id: id}), data);
};

//测试打印自画面单
export const url_test_custom_print = "post|delivery-check/:package_id/test-html-print";
export const api_test_custom_print = function (id, data) {
    return http(Url2(url_test_custom_print, {package_id: id}), data);
};