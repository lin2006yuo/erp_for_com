import {http} from '../lib/http-plus';
export const url_area_analysis = 'get|report/area-sales-analysis';
export const api_area_analysis = function (params) {
    return http(url_area_analysis, params)
};
//
export const url_export_analysis = 'post|report/area-sales-analysis/export';
export const api_export_analysis = function (data) {
    return http(url_export_analysis,data)
};
