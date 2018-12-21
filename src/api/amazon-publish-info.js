import {http} from '../lib/http-plus';

//账号
export const url_amazon_account = 'get|member-ship/2/sales/publish';
export const api_amazon_account = function () {
    return http(url_amazon_account);
};
//仓库
export const url_amazon_warehouse = 'get|publish/amazon-publish/warehouses';
export const api_amazon_warehouse = function () {
    return http(url_amazon_warehouse);
}

//属性分类
export const url_attr_category = 'get|publish/amazon-publish/xsd-category';
export const api_attr_category = function () {
    return http(url_attr_category)
}

//动态属性
export const url_fix_attribute = 'get|publish/amazon-publish/fix-attribute';
export const api_fix_attribute = function () {
    return http(url_fix_attribute)
};

//产品分类
export const url_product_category = 'get|publish/amazon-publish/category';
export const api_product_category = function (data) {
    return http(url_product_category, data)
};

//产品分类搜索
export const url_product_search = 'get|publish/amazon-publish/search-categories';
export const api_product_search = function (data) {
    return http(url_product_search, data)
};

//variation搜索
export const url_variation_search = 'get|publish/amazon-publish/variant';
export const api_variation_search = function (data) {
    return http(url_variation_search, data)
};

// 带出信息
export const url_goods_info = 'get|publish/amazon-publish/goods-info';
export const api_goods_info = function (data) {
    return http(url_goods_info, data);
};

//保存刊登详情
export const url_add_listing = 'post|publish/amazon-publish/add-listing';
export const api_add_listing = function (data) {
    return http(url_add_listing, data);
};
//保存刊登详情 publish/amazon/detail  张冬冬
export const url_save_listing = 'post|publish/amazon/detail';
export const api_save_listing = function (data) {
    return http(url_save_listing, data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};

//普通属性
export const url_common_attribute = 'get|publish/amazon-publish/common-attribute';
export const api_common_attribute = function (data) {
    return http(url_common_attribute, data)
};
//获取页面所有的字段规则
export const url_amazon_field = 'get|publish/amazon/field';
export const api_amazon_field = function (data) {
    return http(url_amazon_field, data)
};
//刊登属性接口
export const url_amazon_templatelist = 'get|publish/amazon/template';
export const api_amazon_templatelist = function (data) {
    return http(url_amazon_templatelist, data)
};
//编辑获取详情
export const url_publish_amazon_edit = 'get|publish/amazon/edit';
export const api_publish_amazon_edit = function (data) {
    return http(url_publish_amazon_edit, data)
};
//编辑草稿箱
export const url_edit_amazon_draft = 'get|publish/amazon/:id/draft';
export const api_edit_amazon_draft = function (id) {
    return http(Url2(url_edit_amazon_draft,{id:id}))
};
//保存到草稿箱 publish/amazon/draft
export const url_publish_amazon_draft = 'post|publish/amazon/draft';
export const api_publish_amazon_draft = function (data) {
    return http(url_publish_amazon_draft,data)
};
//获取UPC
export const url_get_upc = 'get|publish/amazon/:number/upc';
export const api_get_upc = function (number) {
    return http(Url2(url_get_upc,{number:number}),{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    })
};
//翻译
export const url_translate = 'post|publish/amazon/translate';
export const api_translate = function (data) {
    return http(url_translate,{data:data})
};

//计算刊登销售价
export const url_pricing_rules = 'post|pricing-rules/calculate';
export const api_pricing_rules = function (data) {
    return http(url_pricing_rules,data)
};

