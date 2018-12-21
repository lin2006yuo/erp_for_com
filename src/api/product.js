/**
 * Created by wuchuguang on 16-10-26.
 */
import {http} from '../lib/http-plus';
/*开发产品列表*/
export const url_product_list = 'get|goodsdev';
export const product_list = function(data){
    return http(Url2(url_product_list), data);
};
/*开发产品流程处理接口*/
export const url_process_handle = "put|goodsdev/process/:id";
export const process_handle = function(id,data){
    return http(Url2(url_process_handle,{id:id}),data)
};
/*批量操作流程接口*/
export const url_batch_process = "post|goodsdev/batch/process";
export const batch_process = function (data) {
    return http(Url2(url_batch_process),data);
}
/*获取开发产品基础信息*/
export const url_product_base = 'get|goodsdev/base/:id';
export const product_base = function(id){
    return http(Url2(url_product_base,{id:id}));
};
/*获取开发产品供应商信息*/
export const url_product_supplier = "get|goodsdev/supplier/:id";
export const product_supplier = function (id) {
    return http(Url2(url_product_supplier,{id:id}));
}
/*获取开发产品规格*/
export const url_product_specification = "get|goodsdev/specification/:id";
export const product_specification = function (id) {
    return http(Url2(url_product_specification,{id:id}));
}
/*获取编辑开发SKU列表*/
export const url_product_skuinfo = "get|goodsdev/skuinfo/:id/edit";
export const product_skuinfo = function (id) {
    return http(Url2(url_product_skuinfo,{id:id}));
}
/*获取质检信息*/
export const url_qc_msg = "get|goods/qcitems/:id/edit";
export const qc_msg = function (id) {
    return http(Url2(url_qc_msg,{id:id}));
}
/*更新质检信息*/
export const url_update_qc_msg = "put|goodsdev/qcitems/:id";
export const update_qc_msg = function (id,data) {
    return http(Url2(url_update_qc_msg,{id:id}),data);
}
/*更新开发产品sku列表*/
export const url_update_sku = "put|goodsdev/skuinfo/:id";
export const api_update_sku = function (id,data) {
    return http(Url2(url_update_sku,{id:id}),data);
}
/*更新供应商*/
export const url_publish_updata_supplier = "post|supplier/setDefault";
export const publish_updata_supplier = function(data) {
    return http(Url2(url_publish_updata_supplier), data)
};
/*获取开发产品属性信息*/
export const url_product_attribute = "get|goodsdev/attribute/:id";
export const product_attribute = function(id){
    return http(Url2(url_product_attribute,{id:id}));
}
/*获取开发产品描述列表*/
export const url_product_description = "get|goodsdev/description/:id";
export const producr_description = function (id) {
    return http(Url2(url_product_description,{id:id}));
}
/*获取开发产品日志列表*/
export const url_product_log = "get|goodsdev/log/:id";
export const product_log = function(id){
    return http(Url2(url_product_log,{id:id}));
}
/*添加产品备注------待定*/
export const url_product_add_log = "post|goodsdev/log/:id";
export const product_add_log = function(id,data){
    return http(Url2(url_product_add_log,{id:id}),data);
}

/*获取包装材料*/
export const url_packing = "get|packing/dictionary";
export const api_packing =function () {
    return http(Url2(url_packing));
}
/*获取产品单位*/
export const url_unit = "get|unit/dictionary";
export const api_unit =function() {
    return http(Url2(url_unit));
}
/*获取品牌*/
export const url_brand = "get|brand/dictionary";
export const api_brand =function() {
    return http(Url2(url_brand));
}
/*侵权风险*/
export const url_tort = "get|tort/dictionary";
export const api_tort = function () {
    return http(Url2(url_tort));
}
/*获取标签*/
export const url_tag = "get|tag/dictionary";
export const api_tag =function() {
    return http(Url2(url_tag));
}
/*获取语言字典*/
export const url_lang = "get|lang/dictionary";
export const api_lang = function () {
    return http(Url2(url_lang));
}
/*获取仓库类型*/
export const url_warehouse_type = "get|delivery/getWarehouseChannel";
export const api_warehouse_type = function () {
    return http(Url2(url_warehouse_type));
}
/*获取平台销售状态*/
export const url_platform = "get|goods/platform-sale-status";
export const api_platform = function () {
    return http(Url2(url_platform));
}
/*更新开发产品基础信息*/
export const url_update_base = "put|goodsdev/base/:id";
export const api_update_base = function (id,data) {
    return http(Url2(url_update_base,{id:id}),data);
}
/*更新规格参数*/
export const url_specification_info = "put|goodsdev/specification/:id";
export const api_specification_info = function (id,data) {
    return http(Url2(url_specification_info,{id:id}),data);
}
/*更新产品属性*/
export const url_product_attr = "put|goodsdev/attribute/:id";
export const api_product_attr = function (id,data) {
    return http(Url2(url_product_attr,{id:id}),data);
}
/*更新产品描述*/
export const url_update_desc = "put|goodsdev/description/:id";
export const api_update_desc = function (id,data) {
    return http(Url2(url_update_desc,{id:id}),data);
}
export const url_publish_edit_lang= "get|lang/dictionary";
export const publish_edit_lang= function() {
    return http(Url2(url_publish_edit_lang));
};
/*获取流程按钮组*/
export const url_processbtn = "get|goodsdev/processbtn";
export const api_processbtn = function (id) {
    return http(Url2(url_processbtn),id);
}
/*获取操作按钮根据流程ID接口*/
export const url_process_id = "get|goodsdev/processbtn/:process_id";
export const api_process_id = function (id) {
    return http(Url2(url_process_id,{process_id:id}));
}
/*获取开发流程节点列表*/
export const url_process_node = "get|goodsdev/node/:id";
export const api_process_node = function (id) {
    return http(Url2(url_process_node,{id:id}));
}
//请求所有图片
export const url_publish_img = "get|goods-image/:id";
export const publish_img  = function(id) {
    return http(Url2(url_publish_img , {id:id}));
};
//上传单个图片
export const url_update_img = "post|goods-image";
export const api_update_img  = function(data) {
    return http(Url2(url_update_img), data);
};
//修图要求 编辑查看时的数据
export const url_get_mdf_img = 'get|goodsdev/:id/img-requirement';
export const api_get_mdf_img = function (id) {
    return http(Url2(url_get_mdf_img,{id:id}))
}
//所有的修图要求
export const url_img_requirement = 'get|goods/img-requirement';
export const api_img_requirement = function () {
    return http(url_img_requirement);
};
//所有的修图要求
export const url_up_img_requirement = 'put|goodsdev/:id/img-requirement';
export const api_up_img_requirement = function (id,data) {
    return http(Url2(url_up_img_requirement,{id:id}),data);
};



