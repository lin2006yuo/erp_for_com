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
