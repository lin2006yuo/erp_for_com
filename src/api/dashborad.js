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
export const url_fba_nearby15 = "get|dashboard/fba-nearby15";
export const api_fba_nearby15 = function(){
    return http(url_fba_nearby15,{channel_id:2})
};

/*首页仓库统计列表*/
export const url_warehouse_package = "get|report/warehouse-package";
export const api_warehouse_package = function(data){
    return http(url_warehouse_package,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};

/*未操作包裹详情*/
export const url_warehouse_package_detail ="get|report/warehouse-package/unpacked-detail";
export const api_warehouse_package_detail = function(data){
    return http(url_warehouse_package_detail,data);
};

/*未发货记录列表*/
export const url_warehouse_package_unfilled = "get|report/warehouse-package/log-unfilled";
export const api_warehouse_package_unfilled =function(data){
    return http(url_warehouse_package_unfilled,data);
};

/*未发货记录详情*/
export const url_warehouse_package_unfilled_detail = "get|report/warehouse-package/log-unfilled-details";
export const api_warehouse_package_unfilled_detail = function(data) {
    return http(url_warehouse_package_unfilled_detail,data);
};

/*已发货记录*/
export const url_warehouse_package_shipped ="get|report/warehouse-package/log-shipped";
export const api_warehouse_package_shipped = function(data){
    return http(url_warehouse_package_shipped,data)
};

/*已发货记录详情*/
export const url_warehouse_package_shipped_detail = "get|report/warehouse-package/log-shipped-details"
export const api_warehouse_package_shipped_detail =function(data){
    return http(url_warehouse_package_shipped_detail,data);
};

/*未拆包记录*/
export const url_warehouse_package_not_opened = "get|report/warehouse-package/log-not-opened";
export const api_warehouse_package_not_opened = function(data){
    return http(url_warehouse_package_not_opened,data);
};

/*缺货记录*/
export const url_warehouse_package_stock ="get|report/warehouse-package/log-stock";
export const api_warehouse_package_stock =function(data){
    return http(url_warehouse_package_stock,data);
};

/*缺货记录详情*/
export const url_warehouse_package_stock_details = "get|report/warehouse-package/log-stock-details";
export const api_warehouse_package_stock_details = function(data){
    return http(url_warehouse_package_stock_details,data);
};

/*仓库列表*/
export const url_warehouse_list = "get|report/warehouse-package/warehouse";
export const api_warehouse_list = function(data){
    return http(url_warehouse_list,data);
};

/* 账号销售量统计 */
export const url_account_info = "get|dashboard/account-info";
export const api_account_info = function(data){
    return http(url_account_info,data);
};
