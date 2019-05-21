/**
 * Created by Administrator on 2017/10/13.
 */
import {http} from '../lib/http-plus';

export const url_get_order_details = "get|report/order-details";
export const api_get_order_details = function(data) {
    return http(url_get_order_details, data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};

//导出申请
export const url_export_order_details = "post|report/order-details/export";
export const api_export_order_details = function(data) {
    return http(url_export_order_details, data);
};
