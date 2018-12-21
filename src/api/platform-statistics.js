/**
 * Created by Administrator on 2018/7/18.
 */
import {http} from '../lib/http-plus';

//平台
export const url_get_channels = "get|global/channels";
export const api_get_channels = function(data){
    return http(Url2(url_get_channels), data);
};

//spu刊登统计
export const url_get_publish = "get|publish-statistic";
export const api_get_publish = function(data){
    return http(Url2(url_get_publish), data);
};

//刊登报表导出
export const url_export_publish = "post|publish-statistic-export";
export const api_export_publish = function(data){
    return http(Url2(url_export_publish), data);
};
//统计刊登上架spu列表
export const url_publised_on="get|report/publish-by-shelf";
export const api_publised_on = function(data){
    return http(url_publised_on, data);
};
//统计刊登下架spu列表
export  const  url_publised_off="get|report/publish-by-picking";
export  const api_publised_off=function (data) {
    return http(url_publised_off,data)
}
//统计刊登下架spu导出
export  const url_publised_off_export="post|report/publish-by-picking/export";
export  const  api_publised_off_export=function (data) {
    return http(url_publised_off_export,data)
}
//统计刊登上架spu导出
export  const url_publised_on_export="post|report/publish-by-shelf/export";
export  const  api_publised_on_export=function (data) {
    return http(url_publised_on_export,data)
}

//下架spu详情
export  const  url_off_spu="get|report/publish-by-picking/sup"
export  const  api_off_spu=function (data) {
    return http(url_off_spu,data)
}
//上架spu详情
export  const url_on_spu="get|report/publish-by-shelf/sup"
export const api_on_spu=function (data) {
        return http(url_on_spu,data)
}