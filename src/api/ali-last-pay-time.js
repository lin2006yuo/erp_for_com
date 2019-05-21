/**
 * Created by RondaFul on 2019/4/28.
 */
import {http} from '../lib/http-plus';
//获取列表
export const url_ali_pay_time_list= "get|purchase-order-ali1688";
export const api_ali_pay_time_list  = function(data) {
    return http(Url2(url_ali_pay_time_list),data);
};
//导出
export const url_ali_pay_time_export = "post|purchase-order-ali1688/export";
export const api_ali_pay_time_export = function(data){
    return http(url_ali_pay_time_export,data)
};
//获取导出字段
export const url_ali_pay_export_fields = "get|purchase-order-ali1688/export-fields";
export const api_ali_pay_export_fields = function(data) {
    return http(Url2(url_ali_pay_export_fields), data);
};
// 获取我的模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
//获取1688账号
export const url_finance_ali_account = "get|ali1688Account/get-ali-account";
export const api_finance_ali_account = function(data) {
    return http(url_finance_ali_account, data);
};






