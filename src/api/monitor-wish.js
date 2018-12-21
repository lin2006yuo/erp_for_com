
import {http} from '../lib/http-plus';
//列表
export const url_wish_account = 'get|wish-account-health';
export const api_wish_account = function (data) {
    return http(url_wish_account,data);
};
//批量设置
export const url_wish_setting_all = 'post|wish-account-health';
export const api_wish_setting_all = function (data) {
    return http(url_wish_setting_all,data);
};
//单个设置
export const url_wish_setting_single = 'put|wish-account-health';
export const api_wish_setting_single = function (data) {
    return http(url_wish_setting_single,data);
};
//手动抓取
export const url_wish_repitle = 'post|wish-account-health/repitle';
export const api_wish_repitle = function (data) {
    return http(url_wish_repitle,data);
};
//历史数据
export const url_wish_history = 'get|wish-account-health/:wish_account_id/history';
export const api_wish_history = function (id) {
    return http(Url2(url_wish_history,{wish_account_id:id}));
};
// 付款记录
export const url_wish_pay = 'get|wish-account-health/:wish_account_id/payment';
export const api_wish_pay = function (id) {
    return http(Url2(url_wish_pay,{wish_account_id:id}));
};
// 导出
export const url_wish_export = 'get|wish-account-health/export';
export const api_wish_export = function (data) {
    return http(url_wish_export,data);
};
//查看 编辑
export const url_wish_edit = 'get|wish-account-health/:wish_account_id/goal';
export const api_wish_edit = function (id) {
    return http(Url2(url_wish_edit,{wish_account_id:id}));
};
//查看 编辑
export const url_wish_acount = 'get|wish-account-health/account';
export const api_wish_acount = function () {
    return http(url_wish_acount);
};