/**
 * Created by wuchuguang on 17-1-20.
 */
import {http} from '../lib/http-plus';

//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};
export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};
//获取账号
export const url_get_accounts_list = "get|orders/accounts";
export const api_get_accounts_list = function (data) {
    return http(url_get_accounts_list,data);
};

//获取站点
export const url_get_sites = "get|orders/sites";
export const api_get_sites = function (data) {
    return http(url_get_sites,data);
};
//获取店铺list
export const url_get_orders_shop = "get|orders/shop";
export const api_get_orders_shop = function (data) {
    return http(url_get_orders_shop,data);
};
//获取虚拟跟踪号列表
export const url_get_virtual_tracking = "get|virtual-tracking";
export const api_get_virtual_tracking = function (data) {
    return http(url_get_virtual_tracking, data);
};

//导出
export const url_export_virtual_tracking= "post|virtual-tracking/export";
export const api_export_virtual_tracking = function(datas,header){
    return http(url_export_virtual_tracking, datas, header);
};

//获取获取导出execl字段
export const url_get_virtual_tracking_title= "get|virtual-tracking/title";
export const api_get_virtual_tracking_title = function(data){
    return http(url_get_virtual_tracking_title, data)
};
// 获取我的模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
//虚拟跟踪号标记处理
export const url_batch_dispose = "put|virtual-tracking/batch/dispose";
export const api_batch_dispose = function(data){
    return http(url_batch_dispose, data);
};
