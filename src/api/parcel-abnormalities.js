/**
 * Created by Administrator on 2017/11/28.
 */
import {http} from '../lib/http-plus';
export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function(){
    return http(url_entrepot_picking)
};

export const url_package_collection = "get|package-collection/problem";
export const api_package_collection = function (data) {
    return http(url_package_collection, data);
};

export const url_status_change = "get|package-collection/problem/status";
export const api_status_change = function () {
    return http(url_status_change);
};

export const url_message_deal = "put|package-collection/problem/:id/handle";
export const api_message_deal = function (id) {
    return http(Url2(url_message_deal,{id}));
};

//批量重新集包
export const url_batch_deal = "post|package-collection/problem/batch-handle";
export const api_batch_deal = function (id) {
    return http(Url2(url_batch_deal), id);
};

//获取异常类型
export const url_problem_type = "get|package-collection/problem-type";
export const api_problem_type = function (id) {
    return http(url_problem_type, id);
};

//获取异常处理措施
export const url_problem_method = "get|package-collection/problem-method";
export const api_problem_method = function (data) {
    return http(url_problem_method,data)
};

//批量重新集包
export const url_batch_reset = "post|package-collection/batch/reset-collection";
export const api_batch_reset = function (data) {
    return http(url_batch_reset, data);
};

//批量作废
export const url_batch_cancel = "post|package-collection/batch/package-cancel";
export const api_batch_cancel = function (data) {
    return http(url_batch_cancel, data);
};

//设置预估重量
export const url_set_weight = "post|package-collection/batch/set-weight";
export const api_set_weight = function (data) {
    return http(url_set_weight, data);
};

//批量发货
export const url_batch_self = "post|package-collection/self-do";
export const api_batch_self = function (data) {
    return http(url_batch_self, data);
}