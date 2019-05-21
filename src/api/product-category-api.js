import {http} from '../lib/http-plus';
//产品模板列表（产品模板）
export const url_product_list = 'get|amazon-template/product';
export const api_product_list = function(data){
    return http(url_product_list, data);
};
//分类模板列表（分类模板）
export const url_category_list = 'get|amazon-template/category';
export const api_category_list = function(data){
    return http(url_category_list, data);
};
//模板站点&创建人 /amazon-template/:type/creator
export const url_get_site_creator = 'get|amazon-template/:type/creator';
export const api_get_site_creator = function(type){
    return http(Url2(url_get_site_creator,{type:type}));
};
//模板详情读取
export const url_edit_amazon_template = 'get|amazon-template/:id/edit';
export const api_edit_amazon_template = function(id){
    return http(Url2(url_edit_amazon_template,{id:id}));
};
//模板删除和批量删除
export const url_amazon_template_del = 'get|amazon-template/del';
export const api_amazon_template_del = function(data){
    return http(url_amazon_template_del,data);
};
// 模板启用停用
export const url_amazon_template_status = 'get|amazon-template/status/:id/:enable';
export const api_amazon_template_status = function(id,enable){
    return http(Url2(url_amazon_template_status,{id:id,enable:enable}));
};
//取产品模板所属元素 amazon-template/productbase
export const url_get_productbase = 'get|amazon-template/productbase';
export const api_get_productbase = function(id,enable){
    return http(url_get_productbase);
};
//新建模板 amazon-template
export const url_add_amazon_template = 'post|amazon-template';
export const api_add_amazon_template = function(data){
    return http(url_add_amazon_template,data);
};
//更新模板  amazon-template
export const url_update_amazon_template = 'put|amazon-template';
export const api_update_amazon_template = function(data){
    return http(url_update_amazon_template,data);
};
//获取不同分类下的亚马逊分类 amazon-template/categorybase/:site(\d+)
export const url_get_amazon_categorybase = 'get|amazon-template/categorybase/:site';
export const api_get_amazon_categorybase = function(site){
    return http(Url2(url_get_amazon_categorybase,{site:site}));
};
//根据模板所属分类，取所属元素
export const url_get_amazon_categoryele = 'get|amazon-template/categoryele';
export const api_get_amazon_categoryele = function(data){
    return http(url_get_amazon_categoryele,data);
};
//获取亚马逊站点
export const url_get_amazon_site = 'get|publish/amazon/site';
export const api_get_amazon_site = function(){
    return http(url_get_amazon_site);
};
//获取分类模板&&产品模板 共同接口，通过参数type判断
export const url_publish_templatelist = 'get|publish/amazon/templatelist';
export const api_publish_templatelist = function (data) {
    return http(url_publish_templatelist,data)
};
//获取刊登属性接口
export const url_publish_amazon_template = 'get|publish/amazon/template';
export const api_publish_amazon_template = function (data) {
    return http(url_publish_amazon_template,data)
};
//AMAZON刊登范本
export const url_publish_amazon_doc = 'get|publish/amazon/doc';
export const api_publish_amazon_doc = function (data) {
    return http(url_publish_amazon_doc,data)
};
//未写范本列表接口
export const url_publish_amazon_undoc = 'get|publish/amazon/undoc';
export const api_publish_amazon_undoc = function (data) {
    return http(url_publish_amazon_undoc,data)
};
//范本创建者接口
export const url_publish_amazon_doc_creator = 'get|publish/amazon/doc-creator';
export const api_publish_amazon_doc_creator = function () {
    return http(url_publish_amazon_doc_creator)
};
//范本删除
export const url_publish_amazon_doc_del = 'get|publish/amazon/doc-del';
export const api_publish_amazon_doc_del = function (data) {
    return http(url_publish_amazon_doc_del,data)
};
//get基础数据
export const url_doc_base_field = 'get|publish/amazon/doc-base-field';
export const api_doc_base_field = function (data) {
    return http(url_doc_base_field,data)
};
//新增范本数据
export const url_doc_site_field = 'get|publish/amazon/doc-site-field';
export const api_doc_site_field = function (data) {
    return http(url_doc_site_field,data)
};
// 保存范本数据
export const url_doc_save = 'post|publish/amazon/doc-save';
export const api_doc_save = function (data) {
    return http(url_doc_save,data)
};
//编辑复制范本数据
export const url_doc_edit_field = 'get|publish/amazon/doc-edit-field';
export const api_doc_edit_field = function (data) {
    return http(url_doc_edit_field,data)
};


