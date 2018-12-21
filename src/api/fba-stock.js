import {http} from '../lib/http-plus';

// fba 仓库列表 get http://api.rondaful.com/warehouse/info
export const url_warehouse_info = "get|warehouse/info";
export const api_warehouse_info = function(params){
    return http(url_warehouse_info, params);
};
// FBA库存 Get：  http://172.18.8.242/warehouse-goods/fba
export const url_fba_stock_list = "get|warehouse-goods/fba";
export const api_stock_list = function(params){
    return http(url_fba_stock_list, params);
};
