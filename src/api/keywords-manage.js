/**
 * Created by RondaFul on 2019/3/1.
 */
import {http} from '../lib/http-plus';
//获取关键词管理列表
export const url_keywords_manage_list = "get|keywords-manage";
export const api_keywords_manage_list = function(data){
    return http(url_keywords_manage_list,data);
};
//获取关键词记录列表
export const url_keywords_record_list = "get|keywords-list";
export const api_keywords_record_list = function(data){
    return http(url_keywords_record_list,data);
};
//更改列表状态(关键词管理)
export const url_keywords_manage_status = "put|keywords-manage/keyword-status";
export const api_keywords_manage_status = (data)=> {
    return http(url_keywords_manage_status,data);
};
// 获取渠道id(平台)
export const url_keywords_manage_channel = "get|keywords-manage/channel";
export const api_keywords_manage_channel = function(data){
    return http(url_keywords_manage_channel,data);
};
// 获取渠道id(平台, 添加时带过滤不是这个平台的不显示)
export const url_keywords_manage_permissioned_chanel = "get|keywords-manage/permissioned-channel";
export const api_keywords_manage_permissioned_chanel = function(data){
    return http(url_keywords_manage_permissioned_chanel,data);
};
// 获取关键词类型
export const url_keywords_manage_type = "get|keywords-manage/type";
export const api_keywords_manage_type = function(data){
    return http(url_keywords_manage_type,data);
};
//添加数据(关键词管理)
export const url_keywords_manage_add = "post|keywords-manage/add";
export const api_keywords_manage_add = function(data){
    return http(url_keywords_manage_add,data);
};
// 删除一条记录(关键词管理)
export const url_keywords_manage_delete = "delete|keywords-manage/delete";
export const api_keywords_manage_delete = function(data){
    return http(url_keywords_manage_delete,data);
};
// 获取ebay账号简称(关键词管理记录)
export const url_keywords_ebay_account = "get|keywords-list/ebay-account";
export const api_keywords_ebay_account = function(data){
    return http(url_keywords_ebay_account,data);
};
// 获取亚马逊账号简称(关键词管理记录)
export const url_keywords_amazon_account = "get|keywords-list/amazon-account";
export const api_keywords_amazon_account = function(data){
    return http(url_keywords_amazon_account,data);
};
// 获取速卖通账号简称(关键词管理记录)
export const url_keywords_aliexpress_account = "get|keywords-list/aliexpress-account";
export const api_keywords_aliexpress_account = function(data){
    return http(url_keywords_aliexpress_account,data);
};
// 查看内容(关键词管理记录)
export const url_keywords_list_view = "get|keywords-list/view";
export const api_keywords_list_view = function(data){
    return http(url_keywords_list_view,data);
};
