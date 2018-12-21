/**
 * Created by Administrator on 2017/6/12.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

export const parcel_get = "get|purchase-parcels/getParcelList";
export const api_parcel_get = function (params) {
    return http(parcel_get, params);
};

export const url_parcel_receipt = "post|purchase-parcels/receiptParcel";
export const api_parcel_receipt = function (params) {
    return http(url_parcel_receipt, params);
};

export const url_parcel_search = "get|purchase-parcels/getParcelListForParcelSplitting";
export const api_parcel_search = function (params) {
    return http(url_parcel_search, params);
};

//获取仓库
export const url_get_warehouse = "get|delivery/getWarehouseChannel";
export const api_get_warehouse = function () {
    return http(url_get_warehouse)
};

//查看SKU信息
export const url_sku = "get|goods/comparison/:id";
export const api_url_sku = function (id) {
    return http(Url2(url_sku, {id: id}));
};

//复核查看SKU信息
export const url_get_sku = "get|sku-check/:id/edit";
export const api_url_get_sku = function (id) {
    return http(Url2(url_get_sku, {id: id}));
};
//复核修改SKU信息
export const url_check_sku = "put|sku-check/:id";
export const api_url_check_sku = function (id, data) {
    return http(Url2(url_check_sku, {id: id}), data);
};
//获取打印产品标签
export const url_lable_data = "get|label-print";
export const api_lable_data = function (data) {
    return http(url_lable_data, data);
};
//获取打印箱唛标签打印数据
export const url_lable_box_data = "get|label-print/box-label";
export const api_lable_box_data = function (data) {
    return http(url_lable_box_data, data);
};
//获取批量打印标签的数据
export const url_print_label = "get|label-print/batch-sku";
export const api_print_label = function (data) {
    return http(url_print_label, data);
};
//获取批量打印箱唛的数据
export const url_print_lable_box = "get|label-print/batch-sku";
export const api_print_lable_box = function (data) {
    return http(url_print_lable_box, data);
};
//审核
export const url_post_auditParcel = "post|purchase-parcels/auditParcel";
export const api_post_auditParcel = function (data) {
    return http(url_post_auditParcel, data);
};
//获取打印机列表
export const url_get_print = "get|getPrintList";
export const api_get_print = function (data) {
    return http(url_get_print, data);
};

//获取未审核列表
export const url_get_records = "get|purchase-parcels-records";
export const api_get_records = function (data) {
    return http(url_get_records, data);
};

//批量删除未审核列表
export const url_delete_batchDelete = "post|purchase-parcels-records/batchDelete";
export const api_delete_batchDelete = function (data) {
    return http(url_delete_batchDelete, data);
}

//获取待接收条目
export const url_get_order = "get|purchase-order/get-orders";
export const api_get_order = function (data) {
    return http(url_get_order, data);
};

//获取采购单明细
export const url_get_orderdetail = "get|purchase-order/getDetail";
export const api_get_orderdetail = function (data) {
    return http(url_get_orderdetail, data);
};

//拆包异常反馈回写采购单
export const url_order_feedback = "post|purchase-order/remarks";
export const api_order_feedback = function (data) {
    return http(url_order_feedback, data);
};

//拆包异常反馈添加异常列表
export const url_set_parcel_exception = "put|purchase-parcels/abnormal";
export const api_set_parcel_exception = function (data) {
    return http(url_set_parcel_exception, data);
};

//拆包异常包裹列表
export const url_get_parcel_exception = "get|purchase-parcels/abnormal";
export const api_get_parcel_exception = function (data) {
    return http(url_get_parcel_exception, data);
};

//拆包员列表
export const url_unpack_name_list = "get|purchase-parcels/unpacked-list";
export const api_unpack_name_list = function () {
    return http(url_unpack_name_list);
};

//标记拆包异常包裹为处理
export const url_edit_parcel_exception = "put|purchase-parcels/batch/abnormal";
export const api_edit_parcel_exception = function (data) {
    return http(url_edit_parcel_exception, data);
}