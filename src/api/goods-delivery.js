import {http} from '../lib/http-plus';

//获取列表
export const url_goods_brand_link = 'get|goods/brand-link';
export const api_goods_brand_link = function (data) {
    return http(url_goods_brand_link,data)
};
//同步品类接口
export const url_goods_brand_link_category_sync = 'post|goods/brand-link-category/sync';
export const api_goods_brand_link_category_sync = function(data){
    return http(url_goods_brand_link_category_sync,data);
};
//品连推送
export const url_goods_brand_link_push = 'post|goods/brand-link/push';
export const api_goods_brand_link_push = function(data){
    return http(url_goods_brand_link_push,data);
};
//品连推送数据导出
export const url_goods_brand_link_export = 'post|goods/brand-link/export';
export const api_goods_brand_link_export = function(data){
    return http(url_goods_brand_link_export,data);
};
//导入Excel添加SKU
export const url_goods_brand_link_import = 'post|goods/brand-link/import';
export const api_goods_brand_link_import = function(data){
    return http(url_goods_brand_link_import,data);
};
//下载SKU导出模板
export const url_goods_brand_link_import_downfile = 'get|downfile?code=sku_brand_link';
export const api_goods_brand_link_import_downfile = function(data){
    return http(url_goods_brand_link_import_downfile,data);
};
//获取模版
export const url_goods_brand_link_export_fields = 'get|goods/brand-link/export-fields';
export const api_goods_brand_link_export_fields = function(data){
    return http(url_goods_brand_link_export_fields,data);
}
