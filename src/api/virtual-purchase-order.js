import {http} from '../lib/http-plus';

//获取虚拟采购单列表
export const url_get_virtual_purchase_order = 'get|virtual-purchase-order';
export const api_get_virtual_purchase_order = function (data) {
    return http(url_get_virtual_purchase_order,data)
};
//查看虚拟订单
export const url_get_virtual_purchase_order_id = 'get|virtual-purchase-order/:id';
export const api_get_virtual_purchase_order_id = function (id) {
    return http(Url2(url_get_virtual_purchase_order_id,{id}))
};
//获取虚拟采购供应商
export const url_get_supplier_virtual_supplier = 'get|supplier/virtual-supplier';
export const api_get_supplier_virtual_supplier = function (id) {
    return http(url_get_supplier_virtual_supplier)
};
//获取虚拟采购单商品virtual-purchase-order/create-finance
export const url_get_virtual_purchase_order_id_detail = 'get|virtual-purchase-order/:id/detail';
export const api_get_virtual_purchase_order_id_detail = function (id,data) {
    return http(Url2(url_get_virtual_purchase_order_id_detail,{id}),data)
};
//生成虚拟付款申请
export const url_post_virtual_purchase_order_create_finance = 'post|virtual-purchase-order/create-finance';
export const api_post_virtual_purchase_order_create_finance = function (data) {
    return http(url_post_virtual_purchase_order_create_finance,data)
};
//推送到有棵树
export const url_post_virtual_purchase_order_push_yks = 'post|virtual-purchase-order/push-yks';
export const api_post_virtual_purchase_order_push_yks = function (data) {
    return http(url_post_virtual_purchase_order_push_yks,data)
};
//导出接口
export const url_order_export = "post|virtual-purchase-order/export";
export const api_order_export = function (data,head) {
    return http(url_order_export,data,head)
};
//导出字段接口
export const url_export_fields = "get|virtual-purchase-order/export-fields";
export const api_export_fields = function (data) {
    return http(url_export_fields,data)
};
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
//计算采购单的应付款总金额和已付款总金额
export const url_total_amount = "get|virtual-purchase-order/total-amount";
export const api_total_amount = function (data) {
    return http(url_total_amount,data);
};

