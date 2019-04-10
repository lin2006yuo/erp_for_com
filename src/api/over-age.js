import {http} from '../lib/http-plus';

//获取列表
export const url_over_age = "get|report/over-age";
export const api_over_age = function(data){
    return http(url_over_age,data);
};

//导出
export const url_export_over_age = "post|report/over-age/export";
export const api_export_over_age = function(data){
    return http(url_export_over_age,data);
};