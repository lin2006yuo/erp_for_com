import {http} from '../lib/http-plus';
/*产品开发页面
* */
//列表
export const get_goods_dev = 'get|goodsdev';
export const api_goods_dev = function (data) {
    return http(get_goods_dev,data)
};
//获取流程按钮
export const url_process_btn = 'get|goodsdev/processbtn';
export const api_process_btn = function (data) {
    return http(url_process_btn,data)
};
//保存基本信息
export const url_save_baseInfo = 'post|goodsdev/save/base-info';
export const api_save_baseInfo = function (data) {
    return http(url_save_baseInfo,data)
};
//保存 平台分类
export const url_save_platform_sale = 'put|goodsdev/:id/platform-sale';
export const api_save_platform_sale = function (id,data) {
    return http(Url2(url_save_platform_sale,{id:id}),data)
};
//保存供应商信息
export const url_save_supplier = 'put|goodsdev/:id/supplier';
export const api_save_supplier = function (id,data) {
    return http(Url2(url_save_supplier,{id:id}),data)
};
//保存规格参数
export const url_save_sku_list = 'put|goodsdev/:id/sku-list';
export const api_save_sku_list = function (id,data) {
    return http(Url2(url_save_sku_list,{id:id}),data)
};
//保存产品属性
//获取修图要求
export const url_img_requirement = 'get|goods/img-requirement';
export const api_img_requirement = function () {
    return http(url_img_requirement);
};
//保存 修图要求
export const url_save_img_requirement = 'put|goodsdev/:id/img-requirement';
export const api_save_img_requirement = function (id,data) {
    return http(Url2(url_save_img_requirement,{id:id}),data);
};
//菜单列表
export const url_goodsdev_menu = 'get|goodsdev/:id/menu';
export const api_goodsdev_menu = function (id) {
    return http(Url2(url_goodsdev_menu,{id:id}));
};
//获取基础信息详情
export const url_get_base_info = 'get|goodsdev/:id/base-info';
export const api_get_base_info = function (id) {
    return http(Url2(url_get_base_info,{id:id}));
};
//获取平台销售情况
export const url_get_platform_sale = 'get|goodsdev/:id/platform-sale';
export const api_get_platform_sale = function (id) {
    return http(Url2(url_get_platform_sale,{id:id}));
};
//获取供应商
export const url_get_supplier = 'get|goodsdev/:id/supplier';
export const api_get_supplier = function (id) {
    return http(Url2(url_get_supplier,{id:id}));
};
//获取sku列表
export const url_get_sku_list = 'get|goodsdev/:id/sku-list';
export const api_get_sku_list = function (id) {
    return http(Url2(url_get_sku_list,{id:id}));
};
//获取修图要求
export const url_get_edit_requirement = 'get|goodsdev/:id/img-requirement';
export const api_get_edit_requirement = function (id) {
    return http(Url2(url_get_edit_requirement,{id:id}));
};
//流转按钮
export const url_get_processbtn = 'get|goodsdev/processbtn/:id';
export const api_get_processbtn = function (id) {
    return http(Url2(url_get_processbtn,{id:id}));
};
