/**
 * Created by Administrator on 2017/12/6.
 */
import {http} from '../lib/http-plus';

export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function () {
    return http(url_entrepot_picking)
};

//重返上架列表
export const url_get_return = "get|return-shelves";
export const api_get_return = function (data) {
    return http(url_get_return, data)
};

// 退货上架列表
export const url_get_return_reback_shelves_order = "get|reback-shelves-order";
export const api_get_return_reback_shelves_order = function (data) {
    return http(url_get_return_reback_shelves_order, data)
};

//分区
export const url_get_area = "get|putaway-order/types";
export const api_get_area = function (data) {
    return http(Url2(url_get_area), data);
};

//上架
export const url_save_shelves = "post|return-shelves/batch/save";
export const api_save_shelves = function (data) {
    return http(Url2(url_save_shelves), data);
};

//扫描查询
export const url_get_shelves = "get|return-shelves/quantity";
export const api_get_shelves = function (data) {
    return http(Url2(url_get_shelves), data);
};

//扫描查询(退货上架处理)
export const url_reback_shelves_order_quantity = "get|reback-shelves-order/quantity";
export const api_reback_shelves_order_quantity = function (data) {
    return http(Url2(url_reback_shelves_order_quantity), data);
};

//生成上架单
export const url_post_shelves = "post|return-shelves";
export const api_post_shelves = function (data, header) {
    return http(Url2(url_post_shelves), data, header);
};
//生成上架单
export const url_reback_shelves_order = "post|reback-shelves-order";
export const api_reback_shelves_order = function (data, header) {
    return http(Url2(url_reback_shelves_order), data, header);
};

//查看上架单
export const url_look_shelves = "get|return-shelves/:id";
export const api_look_shelves = function (id) {
    return http(Url2(url_look_shelves, {id: id}));
};
//查看上架单
export const url_look_reback_shelves_order = "get|reback-shelves-order/:id";
export const api_look_reback_shelves_order = function (id) {
    return http(Url2(url_look_reback_shelves_order, {id: id}));
};

//作废上架单
export const url_delete_shelves = "delete|return-shelves/delete";
export const api_delete_shelves = function (data) {
    return http(Url2(url_delete_shelves), data);
};
//作废上架单(退货上架)
export const url_delete_reback_shelves = "delete|reback-shelves-order";
export const api_delete_reback_shelves = function (data) {
    return http(Url2(url_delete_reback_shelves), data);
};

//强制完成上架单
export const url_patch_shelves = "put|return-shelves/finish";
export const api_patch_shelves = function (data) {
    return http(Url2(url_patch_shelves), data);
};
//强制完成上架单（重返上架）
export const url_return_shelves_force = "put|return-shelves/force";
export const api_return_shelves_force = function (data) {
    return http(Url2(url_return_shelves_force), data);
};
//完成上架单(退货上架)
export const url_patch_reback_shelves = "put|reback-shelves-order/finish";
export const api_patch_reback_shelves = function (data) {
    return http(Url2(url_patch_reback_shelves), data);
};
//强制完成上架单(退货上架)
export const url_patch_reback_shelves_force = "put|reback-shelves-order/force";
export const api_patch_reback_shelves_force = function (data) {
    return http(Url2(url_patch_reback_shelves_force), data);
};
//生成拣货单
export const url_return_make_pickings = "post|make-pickings/make";
export const api_return_make_pickings = function (data) {
    return http(url_return_make_pickings, data);
};


