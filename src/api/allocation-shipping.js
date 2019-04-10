import {http} from '../lib/http-plus';

//发货管理列表
export const url_allocation_shipping = "get|allocation-shipping";
export const api_allocation_shipping = function (data) {
    return http(url_allocation_shipping, data);
};

//箱子出库交接
export const url_allocation_shipping_deliver = "post|allocation-shipping/deliver";
export const api_allocation_shipping_deliver = function (data) {
    return http(url_allocation_shipping_deliver, data);
};

//强制交货完成
export const url_allocation_force_deliver = "post|allocation-shipping/force-deliver";
export const api_allocation_force_deliver = function (data) {
    return http(url_allocation_force_deliver, data);
};

//批量出库详情
export const url_allocation_shipping_detail = "get|allocation-shipping/detail";
export const api_allocation_shipping_detail = function (data) {
    return http(url_allocation_shipping_detail, data);
};

//批量出库
export const url_allocation_shipping_batch_deliver = "post|allocation-shipping/batch-deliver";
export const api_allocation_shipping_batch_deliver = function (data) {
    return http(url_allocation_shipping_batch_deliver, data);
};