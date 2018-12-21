import{http} from '../lib/http-plus';

//订单系统-物流异常包裹列表页面>集包异常/providers-exception
export const url_package_collection_wait_problem = "get|package-collection/wait-problem";
export const api_package_collection_wait_problem = function (data) {
    return http(url_package_collection_wait_problem,data);
};
//获取异常类型 package-collection/wait-problem-type
export const url_package_collection_wait_problem_type = "get|package-collection/wait-problem-type";
export const api_package_collection_wait_problem_type = function (data) {
    return http(url_package_collection_wait_problem_type,data);
};


//打印面单号
export const url_post_print = "post|delivery-check/:package_id/print";
export const api_post_print = function (package_id,data) {
    return http(Url2(url_post_print,{package_id: package_id}), data);
};

//批量获取面单
export const url_get_packages = "post|packages/batch/label";
export const api_get_packages = function (data) {
    return http(url_get_packages,data);
};
//批量获取跟踪号
export const url_get_tracking = "post|packages/batch/tracking";
export const api_get_tracking = function (data) {
    return http(url_get_tracking,data);
};
//批量释放面单
export const url_free_packages = "post|placeorder/reback";
export const api_free_packages = function (data) {
    return http(url_free_packages,data);
};
//打印发票
export const url_print_invoice = "post|packages/print/invoice";
export const api_print_invoice = function (data) {
    return http(url_print_invoice,data);
};
//获取execl字段
export const url_get_title = "get|packages/export-title";
export const api_get_title = function (data) {
    return http(url_get_title, data);
};
//导出execl字段
export const url_export_title = "post|packages/export";
export const api_export_title = function (data,head) {
    return http(url_export_title, data,head);
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

