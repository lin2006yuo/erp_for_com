/**
 * Created by RondaFul on 2016/12/21.
 */
import {http} from '../lib/http-plus';
export const url_product_tag = "get|tag/dictionary";
export const product_tag = function() {
    return http(Url2(url_product_tag));
};
export const url_product_properties = "get|goods/transport-property";
export const product_properties = function() {
    return http(Url2(url_product_properties));
};
const url_product_unit = "get|unit/dictionary";
export const product_unit = function() {
    return http(Url2(url_product_unit));
};
export const url_product_packing = "get|packing/dictionary";
export const product_packing = function() {
    return http(Url2(url_product_packing));
};
export const url_product_brand = "get|brand/dictionary";
export const product_brand = function() {
    return http(Url2(url_product_brand));
};
export const url_product_tort = "get|tort/dictionary";
export const product_tort = function() {
    return http(Url2(url_product_tort));
};
export const url_product_goodsdev = "get|goodsdev/category-specification/:id";
export const product_goodsdev = function(id) {
    return http(Url2(url_product_goodsdev,{id:id}));
};
export const url_product_attr = "get|goodsdev/category-attribute/:id";
export const product_attr = function(id) {
    return http(Url2(url_product_attr,{id:id}));
};
/*获取仓库类型*/
export const url_warehouse_type = "get|delivery/getWarehouseChannel";
export const warehouse_type = function () {
    return http(Url2(url_warehouse_type));
}
/*获取销售平台状态列表*/
export const url_platform_list = "get|goodsdev/platform-sale";
export const platform_list = function () {
    return http(Url2(url_platform_list));
}
/*获取平台销售状态*/
export const url_platform = "get|goods/platform-sale-status";
export const api_platform = function () {
    return http(Url2(url_platform));
};
/*获取分类SKU列表*/
export const url_sku_list = "post|goodsdev/category-sku";
export const api_sku_list = function (data) {
    return http(Url2(url_sku_list), data);
};
export const url_sku_get = "get|goodsdev/skuinfo/:id/edit";
export const api_sku_get = function (id) {
    return http(Url2(url_sku_get,{id:id}));
};
/*保存开发产品规格*/
export const url_sku_specification = "put|goodsdev/specification/:id";
export const api_sku_specification = function (id,data) {
    return http(Url2(url_sku_specification,{id:id}), data);
};
/*获取供应商*/
export const url_purchasing_getSupplier = "get|supplier-offer/supplier";
export const getSupplier = function(data) {
    return http(Url2(url_purchasing_getSupplier), data);
};
/*查看供应商*/
export const url_supplier = "get|supplier/:id";
export const api_supplier = function (id) {
    return http(Url2(url_supplier,{id:id}));
};
export const url_product_add = "post|goodsdev";
export const product_add = function(data) {
    return http(Url2(url_product_add), data);
};
/*查看*/
export const url_product_check = "get|goodsdev/:id/edit";
export const product_check = function(id) {
    return http(Url2(url_product_check,{id:id}));
};
/*更新*/
export const url_product_update = "put|goodsdev/:id";
export const product_update = function(id,data) {
    return http(Url2(url_product_update,{id:id}),data);
};
/*----流程按钮*/
export const url_product_processBtn = "get|goodsdev/processbtn/:id";
export const product_processBtn = function(id) {
    return http(Url2(url_product_processBtn,{id:id}));
};
/*---按钮操作*/
export const url_product_process = "put|goodsdev/process/:id";
export const product_process = function(id,data) {
    return http(Url2(url_product_process,{id:id}),data);
};
//结算方式
export const url_balance_info = "get|supplier/balance/info";
export const api_balance_info = function() {
    return http(Url2(url_balance_info));
};
//添加产品备注http://api.rondaful.com/goodsdev/log/3
export const url_add_note = "post|goodsdev/log/:id";
export const api_add_note = function (id,data) {
    return http(Url2(url_add_note,{id:id}),data);
}