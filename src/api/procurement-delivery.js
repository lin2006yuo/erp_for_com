/**
 * Created by wuchuguang on 17-1-13.
 */

import {http} from '../lib/http-plus';

export const url_get = "get|safe";
export const api_get = function (params) {
    return http(url_get, params);
};

export const url_warehouse = "get|supplier-offer/warehouse";
export const api_warehouse = function () {
    return http(Url2(url_warehouse));
};

export const url_api_categories = "get|categories";
export const api_categories = function () {
    return http(Url2(url_api_categories));
};
//批量设置安全交期
export const url_change_delivery = "post|safe/changeDelivery";
export const api_change_delivery = function (data) {
    return http(url_change_delivery, data);
};
//保存交期
export const url_save = "post|safe/keep";
export const api_save = function (change) {
    return http(Url2(url_save), {data:change});
};
export const url_import_delivery = "post|safe/import";
export const api_import_delivery = function (data) {
    return http(url_import_delivery,data);
};
//导出接口/purchase-plan/export
export const url_safe_export = "post|safe/export";
export const api_safe_export = function(data) {
    return http(url_safe_export, data);
};
//获取导出模板purchase-plan/export-fields
export const url_safe_export_fields = "get|safe/export-fields";
export const api_safe_export_fields = function(data) {
    return http(Url2(url_safe_export_fields), data);
};
