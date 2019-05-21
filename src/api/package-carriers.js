import {http} from '../lib/http-plus';
//获取列表
export const url_package_carriers = "get|package-carriers";
export const api_package_carriers = function (params) {
    return http(url_package_carriers, params)
};

//集包管理状态
export const url_get_status = "get|package-collection/status";
export const api_get_status = function () {
    return http(url_get_status)
};

//获取导出excel字段
export const url_get_excel_field = "get|package-carriers/export-title";
export const api_get_excel_field = function () {
    return http(url_get_excel_field)
};
//获取导出模板
export const url_export_tempalte = "post|downfile?code=packageCarrier";
export const api_export_tempalte = function () {
    return http(url_export_excel)
};
// 获取我的模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
//导出excel
export const url_export_excel = "post|package-carriers/export";
export const api_export_excel = function (params, header) {
    return http(url_export_excel, params, header)
};

//导入物流商称重和运费
export const url_import = "post|package-carriers/import";
export const api_import = function (params) {
    return http(url_import, params)
};
//确认导入
export const url_import_save = "post|package-carriers/import-save";
export const api_import_save = function (params) {
    return http(url_import_save, params)
};