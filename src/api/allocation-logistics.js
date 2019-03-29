import {http} from '../lib/http-plus';

//物流管理列表
export const url_allocation_logistics = "get|allocation-logistics";
export const api_allocation_logistics = function (data) {
    return http(url_allocation_logistics, data);
};

//上传物流/修改运单号
export const url_allocation_logistics_upload = "put|allocation-logistics/upload";
export const api_allocation_logistics_upload = function (data) {
    return http(url_allocation_logistics_upload, data);
};

//查看物流/发货详细
export const url_allocation_detail = "get|allocation/detail";
export const api_allocation_detail = function (data) {
    return http(url_allocation_detail, data);
};

//箱单导出
export const url_allocation_export = "post|allocation-logistics/export-list";
export const api_allocation_export = function (data) {
    return http(url_allocation_export, data);
};

//导入运费和运单号
export const url_allocation_logistics_import = "post|allocation-logistics/import-tracking";
export const api_allocation_logistics_import = function (data) {
    return http(url_allocation_logistics_import, data);
};