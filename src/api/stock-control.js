/**
 * Created by Administrator on 2017/8/17.
 */
import {http} from '../lib/http-plus';

//获取仓库
export const url_warehouse_get = "get|global/warehouse";
export const api_warehouse_get = function(data){
    return http(url_warehouse_get,data);
};

//获取币种
export const url_get_currency = "get|currency/dictionary";
export const api_get_currency = function(data){
    return http(Url2(url_get_currency));
};

//获取销量及库存管理列表
export const url_get_stock = "get|report/sale-stock";
export const api_get_stock = function(data){
    return http(Url2(url_get_stock), data);
};

//销量及库存管理导出
export const url_export_stock = "post|report/sale-stock/export";
export const api_export_stock = function(data){
    return http(Url2(url_export_stock), data);
};

//获取分类
export const url_get_categories = "get|categories/lists";
export const api_get_categories = function(data){
    return http(Url2(url_get_categories));
};

