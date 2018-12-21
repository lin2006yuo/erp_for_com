import {http} from '../lib/http-plus';
//列表
export const url_ebay_account_health = 'get|ebay-account-health';
export const api_ebay_account_health = function (data) {
    return http(url_ebay_account_health,data);
};

// ebay编辑修改单个设置监控值 put|ebay-account-health/setting/batch
export const url_ebay_account_health_set_one = 'post|ebay-account-health/setting/batch';
export const api_ebay_account_health_set_one = function (data) {
    return http(url_ebay_account_health_set_one,data);
};

//ebay批量设置监控值
export const url_ebay_account_health_set_more = 'post|ebay-account-health/setting/batch';
export const api_ebay_account_health_set_more =  function (data) {
    return http(url_ebay_account_health_set_more,data)
};

//获取指定账号区域的监测阈值
export const url_ebay_account_health_monitor_data = 'get|ebay-account-health/setting/:account_id/:region';
export const api_ebay_account_health_monitor_data = function (account_id,region,data) {
    return http(Url2(url_ebay_account_health_monitor_data,{account_id: account_id,region: region}),data)
};

//ebay帐号监控列表导出
export const url_ebay_account_health_export = 'get|ebay-account-health/export';
export const api_ebay_account_health_export = function (data) {
    return http(url_ebay_account_health_export,data);
};
// ebay抓取
export const url_ebay_account_health_repitle = 'post|ebay-account-health/sync/batch';
export const api_ebay_account_health_repitle = function (data) {
    return http(url_ebay_account_health_repitle,data);
};
