import {http} from '../lib/http-plus';

// 亚马逊账号监控
export const url_amazon_monitor = 'get|report/amazon-monitor';
export const api_amazon_monitor = function (data) {
    return http(url_amazon_monitor, data)
};

// 亚马逊账号监控 -- 导出
export const url_amazon_monitor_export = 'post|report/amazon-monitor/export';
export const api_amazon_monitor_export = function (data) {
    return http(url_amazon_monitor_export, data)
};

// 获取销售员
// get|user/:type/staffs
export const url_get_seller = 'get|user/sales/staffs';
export const api_get_seller = function (data) {
    return http(url_get_seller, data)
};
