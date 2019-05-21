import {http} from '../lib/http-plus';

// fba 仓库列表 get http://api.rondaful.com/warehouse/info
export const url_warehouse_info = "get|warehouse/info";
export const api_warehouse_info = function(params){
    return http(url_warehouse_info, params);
};
// FBA库存 Get：  http://172.18.8.242/warehouse-goods/fba
export const url_fba_stock_list = "get|warehouse-goods/fba";
export const api_stock_list = function(params){
    return http(url_fba_stock_list, params, {
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};

//导出
export const url_post_export_fba_stock = "post|warehouse-goods/export-fba";
export const api_post_export_fba_stock = function(data){
    return http(url_post_export_fba_stock,data)
};

//导入SKU
export const url_post_import_sku = "post|warehouse-goods/import";
export const api_post_import_sku = function(data){
    return http(url_post_import_sku, data)
}

