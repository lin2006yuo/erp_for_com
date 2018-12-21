/**
 * Created by Administrator on 2018/7/25.
 */
import {http} from '../lib/http-plus';

//获取列表
export const url_get_statistic = "get|publish-time-statistic";
export const api_get_statistic= function(data){
    return http(url_get_statistic,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
}

//SPU在各个平台的已刊登数量报表导出
export const url_export_publish = "post|publish-time-statistic-export";
export const api_export_publish = function(data){
    return http(url_export_publish, data);
};
export const url_channel_info="get|report/publish-by-times";
export const api_channel_info=function (data) {
    return http(url_channel_info,data)
}
//平台 列表头
export const url_tab_heard="get|report/publish-by-times/channel";
export const api_tab_heard=function () {
    return http(url_tab_heard)
}

//点击平台数字 详情
export const url_info_channel="get|report/publish-by-times/shelf";
export const api_info_channel=function (data) {
    return http(url_info_channel,data)
}
//导出功能
export const url_export_info="post|report/publish-by-times/export";
export const api_export_info=function (data) {
    return http(url_export_info,data)
}
