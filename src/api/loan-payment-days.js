import {http} from '../lib/http-plus';

export  const url_channel_node = "get|channel-node";
export  const api_channel_node = function (data) {
    return http(url_channel_node,data)
};
//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};
export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};
//获取列表接口
export  const url_index_settle = "get|settlement/index_settle";
export const api_index_settle = function (data) {
    return http(url_index_settle,data)
};

//获取详情
export  const url_index_settle_detail = "get|settlement/settle_detail";
export const api_index_settle_detail = function (data) {
    return http(url_index_settle_detail,data)
};

//导出
export  const url_settle_export = "post|settlement/export";
export const api_settle_export = function (data) {
    return http(url_settle_export,data)
};