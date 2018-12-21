/**
 * Created by RondaFul on 2016/11/14.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

//36.1仓库订单拦截列表
export const url_order_hold = "get|order-hold";
export const api_order_hold = function(data) {
    return http(url_order_hold, data);
};

//36.2仓库订单拦截详情
export const url_order_hold_look = "get|order-hold/:id";
export const api_order_hold_look = function(id) {
    return http(Url2(url_order_hold_look, {id:id}));
};

//36.3仓库订单拦截编辑详情
export const url_order_hold_edit = "get|order-hold/:id/edit";
export const api_order_hold_edit = function(id) {
    return http(Url2(url_order_hold_edit, {id:id}));
};

//36.4更新仓库订单拦截记录
export const url_order_hold_put = "put|order-hold/:id";
export const api_order_hold_put = function(id,data) {
    return http(Url2(url_order_hold_put, {id:id}),data);
};

//36.5更改仓库订单拦截记录状态
export const url_order_hold_batch = "post|order-hold/batch";
export const api_order_hold_batch = function(data) {
    return http(url_order_hold_batch, data);
};

//36.6新增仓库订单拦截记录
export const url_order_hold_status = "post|order-hold";
export const api_order_hold_status = function(data) {
    return http(url_order_hold_status, data);
};

//36.7更改仓库订单拦截记录状态
export const url_order_hold_reason = "get|order-hold/reason";
export const api_order_hold_reason = function() {
    return http(url_order_hold_reason);
};

//36.8新增仓库订单拦截记录导出
export const url_orders_hold_export = "post|order-hold/export";
export const api_orders_hold_export = function(data){
    return http(url_orders_hold_export,data)
};
