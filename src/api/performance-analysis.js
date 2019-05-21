import {http} from '../lib/http-plus';

//lazada账号业绩报表数据
export const url_get_lazada_account_analysis_list = "get|report/lazada-account-report/account";
export const api_get_lazada_account_analysis_list = function (data) {
    return http(url_get_lazada_account_analysis_list, data);
};

//lazada站点业绩报表数据
export const url_get_lazada_site_analysis_list = "get|report/lazada-account-report/site";
export const api_get_lazada_site_analysis_list = function (data) {
    return http(url_get_lazada_site_analysis_list, data);
};

//批量导出
export const url_post_export = "post|report/lazada-account-report/export";
export const api_post_export = function (data) {
    return http(url_post_export, data);
};