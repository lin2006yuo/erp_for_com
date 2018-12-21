/**
 * Created by wuchuguang on 17-1-12.
 */

import {http} from '../lib/http-plus';

export const url_warehouse_type = "get|warehouse/getWarehouseType";
export const api_warehouse_type = function () {
    return http(Url2(url_warehouse_type));
};

export const url_warehouses = "get|orders/warehouse/info";
export const api_warehouses = function () {
    return http(Url2(url_warehouses));
};

export const url_get = "get|purchase-plan";
export const api_get = function (params) {
    return http(Url2(url_get), params);
};
export const url_plan_look = "get|purchase-plan/:id";
export const api_plan_look = function (id) {
    return http(Url2(url_plan_look, {id:id}));
};
// 添加 商品时 取sku
export const url_add_sku= "get|purchase-plan/getSkuInfo";
export const api_add_sku  = function(data) {
    return http(Url2(url_add_sku), data);
};
//获取采购员
export const url_getUser = "get|user/purchase/staffs";
export const getUser = function() {
    return http(Url2(url_getUser));
};
/*添加采购计划*/
export const url_add_plan = "post|purchase-plan";
export const add_plan = function(data) {
    return http(Url2(url_add_plan),data);
};
/*备货----添加采购计划*/
export const url_add_plan_stocking = "post|stocking/save-plan";
export const add_plan_stocking = function(data) {
    return http(url_add_plan_stocking,data);
};

// 获取 查看编辑 sku
export const url_look_sku = "get|purchase-plan/getDetail";
export const add_look_sku = function(data) {
    return http(Url2(url_look_sku),data);
};
// 获取审批采购计划信息
export const url_purchase_plan_detail = "post|purchase-plan/batchEdit";
export const api_purchase_plan_detail = function(data) {
    return http(Url2(url_purchase_plan_detail),data);
};

export const url_look_log = "get|purchase-plan/getLogDetail";
export const add_look_log = function(data) {
    return http(Url2(url_look_log),data);
};

// 编辑
export const url_plan_edit = "get|purchase-plan/:id/edit";
export const api_plan_edit = function (id) {
    return http(Url2(url_plan_edit , {id:id}));
};

export const url_updata_plan = "put|purchase-plan/:id";
export const api_updata_plan = function(id,data) {
    return http(Url2(url_updata_plan , {id:id}),data);
};
//状态
export const url_post_purchase_plan_cancel = "post|purchase-plan/cancel";
export const api_post_purchase_plan_cancel  = function(data) {
    return http(Url2(url_post_purchase_plan_cancel), data);
};
//审批
export const url_purchase_plan_changeStatus = "post|purchase-plan/changeStatus";
export const api_purchase_plan_changeStatus  = function(data) {
    return http(Url2(url_purchase_plan_changeStatus), data);
};
//添加日记
export const url_add_mark= "post|purchase-plan/remarks";
export const api_add_mark  = function(data) {
    return http(Url2(url_add_mark), data);
};
//获取采购员
export const url_get_publish = "get|user/purchase/staffs";
export const api_get_publish = function() {
    return http(Url2(url_get_publish));
};
//SKU价格变动
export const url_get_price_change = "get|purchase-plan/getPurchasePlanPriceChange";
export const api_get_price_change = function(data) {
  return http(Url2(url_get_price_change), data);
};
//导入SKU
export const url_import_sku = "post|purchase-plan/sku/import";
export const api_import_sku = function(data) {
  return http(url_import_sku, data, {
      contentType: 'application/x-www-form-urlencoded',
      timeout: 90000
  });
};
//采购单导出/purchase-plan/export
export const url_purchase_plan_export = "post|purchase-plan/export";
export const api_purchase_plan_export = function(data) {
    return http(url_purchase_plan_export, data);
};
//获取导出模板purchase-plan/export-fields
export const url_purchase_plan_export_fields = "get|purchase-plan/export-fields";
export const api_purchase_plan_export_fields = function(data) {
    return http(Url2(url_purchase_plan_export_fields), data);
};
//批量删除取消的采购计划
export const url_purchase_plan_batch_delete = "post|purchase-plan/batch/delete";
export const api_purchase_plan_batch_delete = function(data) {
    return http(url_purchase_plan_batch_delete, data);
};
