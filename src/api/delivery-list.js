/**
 * Created by Administrator on 2018/7/23.
 */
import {http} from '../lib/http-plus';

//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};

//获取仓库
export const url_get_warehouse = "get|orders/:type/info";
export const api_get_warehouse = function(){
    return http(Url2(url_get_warehouse,{type:'warehouse'}));
};

//获取物流商
export const url_get_carrier = "get|carrier/lists";
export const api_get_carrier = function () {
    return http(url_get_carrier);
};

//获取列表数据
export const url_get_confirm = "get|report/express-confirm";
export const api_get_confirm = function (data) {
    return http(url_get_confirm,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};

//导出接口
export const url_confirm_export = "post|report/express-confirm/export";
export const api_confirm_export = function (data,head) {
    return http(url_confirm_export,data,head);
};

//导出字段标题
export const url_get_export_title = "get|report/express-confirm/export-title";
export const api_get_export_title = function (params) {
    return http(url_get_export_title,params);
};

//导出汇总
export const url_confirm_export_all = "post|report/express-confirm/exports"
export const api_confirm_export_all = function (data, head) {
    return http(url_confirm_export_all, data, head)
}
//导出汇总excel字段
export const url_get_export_title_all = "get|report/export-title"
export const api_get_export_title_all = function (params) {
    return http(url_get_export_title_all,params)
}
//揽收商列表
export  const url_get_collectorlist = 'get|collector/list'
export const api_get_collectorlist = function () {
    return http(url_get_collectorlist)
}

//目的地国家列表
export  const url_get_countrylist = 'get|carrier-platform/shipping/country ';
export const api_get_countrylist = function () {
    return http(url_get_countrylist)
};
