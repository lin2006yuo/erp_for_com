import {http} from '../lib/http-plus';
import {url_get_sales} from "./request-note";
//列表
export const url_aliexpress_account_health = 'get|aliexpress-account-health';
export const api_aliexpress_account_health = function (data) {
    return http(url_aliexpress_account_health,data);
};
//Aliexpress帐号监控列表导出
export const url_aliexpress_account_health_export = 'get|aliexpress-account-health/export';
export const api_aliexpress_account_health_export = function (data) {
    return http(url_aliexpress_account_health_export,data);
};
// Aliexpress帐号监查看历史数据 get|aliexpress-account-health/:account_id/history
export const url_aliexpress_account_health_history = 'get|aliexpress-account-health/:account_id/history';
export const api_aliexpress_account_health_history = function (account_id,data) {
    return http(Url2(url_aliexpress_account_health_history,{account_id:account_id}),data);
};


// Aliexpress帐号监查看付款记录 get|aliexpress-account-health/:account_id/:type/payment
export const url_aliexpress_account_health_payment = 'get|aliexpress-account-health/:account_id/:type/payment';
export const api_aliexpress_account_health_payment = function (account_id,type,data) {
    return http(Url2(url_aliexpress_account_health_payment,{account_id:account_id,type:type}),data);
};

// Aliexpress单个设置监控值 put|aliexpress-account-health
export const url_aliexpress_account_health_set_one = 'put|aliexpress-account-health';
export const api_aliexpress_account_health_set_one = function (data) {
    return http(url_aliexpress_account_health_set_one,data);
};
// Aliexpress批量设置监控值 post|aliexpress-account-health
export const url_aliexpress_account_health_set_more = 'post|aliexpress-account-health';
export const api_aliexpress_account_health_set_more = function (data) {
    return http(url_aliexpress_account_health_set_more,data);
};
// Aliexpress手动设置抓取 post|aliexpress-account-health/repitle
export const url_aliexpress_account_health_repitle = 'post|aliexpress-account-health/repitle';
export const api_aliexpress_account_health_repitle = function (data) {
    return http(url_aliexpress_account_health_repitle,data);
};
// Aliexpress帐号简称数据 get|aliexpress-account-health/account
export const url_aliexpress_account_health_account= 'get|aliexpress-account-health/account';
export const api_aliexpress_account_health_account= function (data) {
    return http(url_aliexpress_account_health_account,data);
};
