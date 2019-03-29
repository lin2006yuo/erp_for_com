/**
 * Created by RondaFul on 2016/11/21.
 */
import {http} from '../lib/http-plus';
//订单列表
export const url_api_order_oberlo_list = "get|oberlo-orders";
export const api_order_oberlo_list = function(data){
    return http(url_api_order_oberlo_list,data);
};
//列表查看详情
export const url_api_oberlo_pandao_check = "get|oberlo-orders/:id";
export const api_order_oberlo_check = function(id){
    return http(Url2(url_api_oberlo_pandao_check,{id:id}));
};
//订单状态
export const url_api_order_oberlo_status = "get|oberlo-orders/status";
export const api_order_oberlo_status = function(data){
    return http(url_api_order_oberlo_status,data);
};

//---账号简称
export const url_api_order_oberlo_getAccount = "get|oberlo-account";
export const api_order_oberlo_getAccount = function(data){
    return http(url_api_order_oberlo_getAccount,data);
};
//导出订单pandao-orders/export
export const url_pandao_orders_export = "post|pandao-orders/export";
export const api_pandao_orders_export = function(data) {
    return http(url_pandao_orders_export, data);
};

export const url_get_pandao_orders_export_fields = "get|pandao-orders/export-fields";
export const api_get_pandao_orders_export_fields = data=>{
    return http(url_get_pandao_orders_export_fields,data)
};
