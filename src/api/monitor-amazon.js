import {http} from '../lib/http-plus';
//获取列表
export const url_amazon_account_health = 'get|amazon-account-health';
export const api_amazon_account_health = function (data) {
    return http(url_amazon_account_health,data);
};

//amazon批量设置监控值
export const url_amazon_account_health_set_more = 'post|amazon-account-health';
export const api_amazon_account_health_set_more =  function (data) {
    return http(url_amazon_account_health_set_more,data)
};

// amazon单个设置监控值 put|ebay-account-health/setting/batch
export const url_amazon_account_health_set_one = 'put|amazon-account-health';
export const api_amazon_account_health_set_one = function (data) {
    return http(url_amazon_account_health_set_one,data);
};

// amazon手动设置抓取
export const url_amazon_account_health_repitle = 'post|amazon-account-health/repitle';
export const api_amazon_account_health_repitle = function (data) {
    return http(url_amazon_account_health_repitle,data);
};

//获取历史数据列表
export const url_amazon_account_health_history = 'get|amazon-account-health/:amazon_account_id/history';
export const api_amazon_account_health_history = function (amazon_account_id,data) {
    return http(Url2(url_amazon_account_health_history,{amazon_account_id:amazon_account_id}),data);
};

//amazon帐号监控列表导出
export const url_amazon_account_health_export = 'get|amazon-account-health/export';
export const api_amazon_account_health_export = function (data) {
    return http(url_amazon_account_health_export,data);
};

//amazon读取单个监控值
export const url_amazon_account_health_single = 'get|amazon-account-health/:amazon_account_id/goal';
export const api_amazon_account_health_single = function (amazon_account_id,data) {
    return http(Url2(url_amazon_account_health_single,{amazon_account_id:amazon_account_id}),data);
};

//获取账号简称及站点列表
export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};