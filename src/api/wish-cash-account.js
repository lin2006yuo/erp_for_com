import{http} from '../lib/http-plus';
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
//列表
export const url_wish_account_list = "get|wish-settlement/index_settle";
export const api_wish_account_list = function (data) {
    return http(url_wish_account_list,data)
};
export const url_wish_account_export = "post|wish-settlement/export";
export const api_wish_account_export = function (data) {
    return http(url_wish_account_export,data)
};
//批量销售员
export const url_get_wish_users = "get|publish/wish/wishUsers";
export const api_get_wish_users = function(data){
    return http(url_get_wish_users, data);
};