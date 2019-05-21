import {http} from '../lib/http-plus';

//账户运营分析列表
export const url_account_operation_analysis = "get|report/account-operation-analysis";
export const api_account_operation_analysis = function (data) {
    return http(url_account_operation_analysis, data);
};

//获取平台
export const url_get_channel = "get|user/login-user-position";
export const api_default_channel = function (data) {
    return http(url_get_channel, data);
};


// 导出标题
export const url_get_export_title = "get|report/account-operation-analysis/export-fields";
export const api_get_export_title = function () {
    return http(url_get_export_title);
};

//导出
export const url_get_export = "post|report/account-operation-analysis/export";
export const api_get_export = function(data, head){
    return http(url_get_export, data, head)
};


