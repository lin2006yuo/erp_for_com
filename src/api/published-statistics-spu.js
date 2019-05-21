import {http} from '../lib/http-plus';

//列表
export  const url_spu_publish_list = "get|report/publish-by-shelf/spu";
export const api_spu_publish_list = function (data) {
    //,{contentType:'application/x-www-form-urlencoded', timeout:60000}
    return http(url_spu_publish_list,data,{contentType:'application/x-www-form-urlencoded', timeout:100000})
};
//导出
export const url_spu_publish_list_export = "post|report/publish-by-shelf/export";
export const api_spu_publish_list_export = function (data) {
    return http(url_spu_publish_list_export,data)
};
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};
//详情
export const url_spu_account_detail = "get|report/publish-by-shelf/spu/account-detail";
export const api_spu_account_detail=function (data) {
    return http(url_spu_account_detail,data)
};