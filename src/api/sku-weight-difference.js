import {http} from '@/lib/http-plus';

//导出接口
export const url_order_export_x = "post|goods-sku/diff-weight-export";
export const api_order_export_http = function (data) {
    return http(url_order_export_x, data)
};


export const sku_weight_diff = "get|goods-sku/diff-weight"
export const sku_weight_diff_http = function(data){
    return http(sku_weight_diff,data);
};