/**
 * Created by Administrator on 2017/8/29.
 */
import {http} from '../lib/http-plus';
//获取币种列表
export const url_get_currency = "get|currency/dictionary";
export const api_get_currency = function(data){
    return http(Url2(url_get_currency), data);
};

//获取商品销量分析报表
export const url_get_analysis = "get|report/goods-analysis";
export const api_get_analysis = function(data){
    return http(Url2(url_get_analysis), data);
};

//导出商品销量分析报表
export const url_export_analysis = "post|report/goods-analysis/export";
export const api_export_analysis = function(data){
    return http(Url2(url_export_analysis), data);
};

//本地仓库存同步销量
export const url_local_synchronous = "post|report/goods-analysis/synchronous";
export const api_local_synchronous = function () {
    return http(url_local_synchronous);
};