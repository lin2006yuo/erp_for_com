import {http} from '../lib/http-plus';

//获取vova订单列表信息
export const url_api_order_vova_list = "get|vova-orders";
export const api_order_vova_list = function(data){
    return http(url_api_order_vova_list,data);
};

//获取所有订单状态
export const url_api_order_vova_status = "get|vova-orders/status-count";
export const api_order_vova_status = function(data){
    return http(url_api_order_vova_status,data);
};

//查看vova订单详情
export const url_api_order_vova_check = "get|vova-orders/:id";
export const api_order_vova_check = function(id){
    return http(Url2(url_api_order_vova_check,{id:id}));
};

//获取账号简称
export const url_account_list = "get|orders/account";
export const api_account_list = function(data){
    return http(url_account_list, data);
};
//导出列表
export const url_vova_orders_export = "post|vova-orders/export";
export const api_vova_orders_export = function(data) {
    return http(url_vova_orders_export,data);
};
// 获取我的模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
// 获取可供选择的导出字段
export const url_vova_orders_export_fields = "get|vova-orders/export-fields";
export const api_vova_orders_export_fields = function (data) {
    return http(url_vova_orders_export_fields,data);
};
