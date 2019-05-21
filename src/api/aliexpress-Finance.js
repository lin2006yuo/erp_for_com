import{http} from '../lib/http-plus';

// 表格列表
export const url_aliexpress_account_list = "get|aliexpress-settlement/index_settle";
export const api_aliexpress_account_list = function (data, header) {
    return http(url_aliexpress_account_list,data, header)
};


// 导出队列。
export const url_aliexpress_account_export = "post|aliexpress-settlement/export";
export const api_aliexpress_account_export = function (data) {
    return http(url_aliexpress_account_export,data)
};

