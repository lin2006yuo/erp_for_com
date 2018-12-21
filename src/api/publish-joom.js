/**
 * Created by RondaFul on 2017/5/9.
 */
import {http} from '../lib/http-plus';
//------------------------------------                                    -joom刊登
//获取 未刊登 列表
export const url_joom_product_list = "get|publish/joom/productList";
export const api_joom_product_list = function(data) {
    return http(url_joom_product_list, data);
};

//6.1 获取joomlisting列表
export const url_joom_listing_list = "get|joomlisting";
export const api_joom_listing_list = function(data) {
    return http(url_joom_listing_list, data);
};

//6.2 获取sku
export const url_joom_list_variant = "get|joomlisting/variant";
export const api_joom_list_variant = function(data) {
    return http(url_joom_list_variant, data);
};

//6.3 拿取Joom销售员
export const url_joom_list_users = "get|joomlisting/users";
export const api_joom_list_users = function(data) {
    return http(url_joom_list_users, data);
};

//6.4 Joomlisting上架和批量上架接口
export const url_joom_list_enable = "post|joomlisting/enable";
export const api_joom_list_enable = function(data) {
    return http(url_joom_list_enable, data);
};

//6.5 Joomlisting下架和批量下架接口
export const url_joom_list_disable = "post|joomlisting/disable";
export const api_joom_list_disable = function(data) {
    return http(url_joom_list_disable, data);
};

//6.6 Joomlisting变体上架和批量上架接口
export const url_joom_variant_enable = "post|joomlisting/variantEnable";
export const api_joom_variant_enable = function(data) {
    return http(url_joom_variant_enable, data);
};

//6.7 Joomlisting变体下架和批量下架接口
export const url_joom_variant_disable = "post|joomlisting/variantDisable";
export const api_joom_variant_disable = function(data) {
    return http(url_joom_variant_disable, data);
};

//6.8 Joomlisting操作日志
export const url_joom_listing_logs = "get|joomlisting/logs";
export const api_joom_listing_logs = function(data) {
    return http(url_joom_listing_logs, data);
};

//6.9 Joomlisting同步
export const url_joom_listing_sync = "post|joomlisting/sync";
export const api_joom_listing_sync = function(data) {
    return http(url_joom_listing_sync, data);
};

//6.11 joom刊登记录
export const url_joom_listing_record = "get|joomlisting/record";
export const api_joom_listing_record = function(data) {
    return http(url_joom_listing_record, data);
};

//6.12 删除出错的joom刊登记录
export const url_joom_listing_delrecord = "get|joomlisting/delrecord";
export const api_joom_listing_delrecord = function(data) {
    return http(url_joom_listing_delrecord, data);
};

//6.13 Joom记录里批量刊登数据
export const url_joom_listing_publish = "get|joomlisting/publish";
export const api_joom_listing_publish = function(data) {
    return http(url_joom_listing_publish, data);
};

//7.1 拿取Joom关键字标签（）
export const url_joom_tag_search = "get|joomtag-search";
export const api_joom_tag_search = function(data) {
    return http(url_joom_tag_search, data);
};

// jJoomlisting批量导出（）
export const url_joom_download = "post|publish/joom/download";
export const api_joom_download = function(data) {
    return http(url_joom_download, data);
};

