/**
 * Created by RondaFul on 2017/5/11.
 */
import {http} from '../lib/http-plus';

//获取缺货列表
export const url_get_stock_lack = "get|stock-lack";
export const api_get_stock_lack = function(data){
  return http(url_get_stock_lack, data);
};
//批量导出
export const url_stock_lack_export = "post|stock-lack/export";
export const api_stock_lack_export = function(data){
    return http(url_stock_lack_export, data);
};
//获取导出模版
export const url_get_stock_lack_export_fields = "get|stock-lack/export-fields";
export const api_get_stock_lack_export_fields = function(data){
    return http(url_get_stock_lack_export_fields, data);
};
//获取在途库存详情
export const url_get_stock_lack_inventory = "get|stock-lack/get-transportation-inventory";
export const api_get_stock_lack_inventory = function(data){
    return http(url_get_stock_lack_inventory, data);
};
