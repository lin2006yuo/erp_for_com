/**
 * Created by Administrator on 2017/8/14.
 */
import {http} from '../lib/http-plus';

//获取账号简称列表
export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};

//获取速卖通账号平台利润汇总表
export const url_aliExpress_list = "get|report/financial/performance/ali";
export const api_aliExpress_list = function(datas){
    return http(url_aliExpress_list, datas);
};

//amazon平台利润汇总表
export const url_amazon_list = "get|report/financial/performance/amazon";
export const api_amazon_list = function(datas){
    return http(url_amazon_list, datas);
};

//ebay平台利润汇总表
export const url_ebay_list = "get|report/financial/performance/ebay";
export const api_ebay_list = function(datas){
    return http(url_ebay_list, datas);
};

//wish平台利润汇总表
export const url_wish_list = "get|report/financial/performance/wish";
export const api_wish_list = function(datas){
    return http(url_wish_list, datas);
};

//fba平台利润汇总表
export const url_fba_list = "get|report/financial/performance/fba";
export const api_fba_list = function(datas){
    return http(url_fba_list, datas);
};

//批量导出
export const url_export_performance = "post|report/financial/export/performance";
export const api_export_performance = function(datas){
    return http(url_export_performance, datas);
};