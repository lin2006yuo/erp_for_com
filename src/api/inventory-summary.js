import {http} from '../lib/http-plus';


//获取所有仓库
export const url_all_warehouse = "get|warehouse/info?sign=all"
export const api_all_warehousre = function (data) {
    return http(url_all_warehouse, data);
};
//表格数据
export const url_invoicing = "get|invoicing/summary"
export const api_get_summary = function (data) {
    return http(url_invoicing, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};
//表格数据-明细
export const url_invoicing_detail = "get|invoicing/detail"
export const api_get_detail = function (data) {
    return http(url_invoicing_detail, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};
//汇总表导出
export const url_export_summary = "post|invoicing/export/summary"
export const api_export_summary = function (data) {
    return http(url_export_summary, data);
};

//明细表导出
export const url_export_detail = "post|invoicing/export/detail"
export const api_export_detail = function (data) {
    return http(url_export_detail, data);
};

