/**
 * Created by Administrator on 2017/11/1.
 */
import {http} from '../lib/http-plus';
//获取货架列表
export const url_warehouse_cargo_goods = "get|warehouse-cargo-goods"
export const warehouse_cargo_goods = function(data){
    return http(url_warehouse_cargo_goods, data);
};
//获取仓库货位库存操作明细列表
export const url_warehouse_cargo_detail = "get|warehouse-cargo-goods/logs"
export const warehouse_cargo_detail = function(data){
    return http(url_warehouse_cargo_detail, data);
};
//货位库存移除
export const url_warehouse_cargo_delete = "delete|warehouse-cargo-goods/:id"
export const warehouse_cargo_delete = function(id){
    return http(Url2(url_warehouse_cargo_delete, {id:id}));
};
//打印sku标签
export const url_get_label = "get|goods/sku-label";
export const api_get_label = function (data) {
    return http(url_get_label,data);
};
//导出
export const warehouse_cargo_goods_export = "post|warehouse-cargo-goods/export";
export const api_warehouse_cargo_goods_export = function (data) {
    return http(warehouse_cargo_goods_export,data);
};

//操作明细
//操作类型 http://api.rondaful.com/warehouse-cargo-goods/log-types
export const warehouse_cargo_goods_log_types = "get|warehouse-cargo-goods/log-types";
export const api_warehouse_cargo_goods_log_types = function (data) {
    return http(warehouse_cargo_goods_log_types,data);
};
// 操作日志搜素http://api.rondaful.com/warehouse-cargo-goods/logs
export const warehouse_cargo_goods_logs = "get|warehouse-cargo-goods/logs";
export const api_warehouse_cargo_goods_logs = function (data) {
    return http(warehouse_cargo_goods_logs,data);
};
//库存转移
export const url_cargo_goods_batch_shift = "post|warehouse-cargo-goods/batch/shift";
export const api_cargo_goods_batch_shift = function (data) {
    return http(url_cargo_goods_batch_shift, data);
};