/**
 * Created by wuchuguang on 17-5-9.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';
export const url_nearby15 = "get|dashboard/nearby15";
export const api_nearyby15 = function(){
    return http(url_nearby15);
};
export const url_order_info = "get|dashboard/orders";
export const api_order_info = function(){
    return http(url_order_info);
};
export const url_account_performance = "get|dashboard/account-performance";
export const api_account_performance = function(channel, account, time){
    return http(url_account_performance,{channel, account, time})
};
// export const url_listing_count = "get|dashborad/listings";
export const url_listing_count = "get|dashboard/listings";
export const api_listing_count = function(){
    return http(url_listing_count)
};
export const url_warehouse_info = "get|dashboard/warehouses";
export const api_warehouse_info = function(){
    return http(url_warehouse_info)
};