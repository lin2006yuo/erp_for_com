/**
 * Created by RondaFul on 2016/11/25.
 */

import {http} from '../lib/http-plus';

export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function () {
    return http(url_entrepot_picking);
};
//本地仓库和海外仓
export const url_warehous_lists = "get|warehouse/lists";
export const api_warehous_lists = function () {
    return http(url_warehous_lists);
};
//海外仓
export const url_warehous_overseas = "get|warehouse/overseas";
export const api_warehous_overseas = function () {
    return http(url_warehous_overseas);
};
//本地
export const url_warehous_local = "get|warehouse/local";
export const api_warehous_local = function (data) {
    return http(url_warehous_local, data);
};
//第三方
export const url_warehous_third = "get|warehouse/third";
export const api_warehous_third = function () {
    return http(url_warehous_third);
};
//中转仓
export const url_warehous_transit = "get|warehouse/transit"
export const api_warehous_transit = function () {
    return http(url_warehous_transit);
};
//第三方仓库类型
export const url_warehous_third_type = "get|warehouse/third-type";
export const api_warehous_third_type = function () {
    return http(url_warehous_third_type);
};
export const url_entrepot_getcount = "get|delivery/:id";
export const entrepot_getcount = function (id, data) {
    return http(Url2(url_entrepot_getcount, {id: id}), data)
};

export const url_entrepot_delivery = "get|delivery";
export const api_get_delivery = function (data) {
    return http(url_entrepot_delivery, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: 30000
    })
};

export const url_entrepot_select = "get|delivery/distriuteInventory";
export const entrepot_select = function (data) {
    return http(url_entrepot_select, data)
};

export const url_back_rule = "post|delivery/back-rule";
export const api_back_rule = function (data) {
    return http(url_back_rule, data)
};

export const url_entrepot_depot = "put|delivery/changeWarehouse";
export const entrepot_depot = function (data) {
    return http(url_entrepot_depot, data)
};

export const url_get_shipping_methods = "get|delivery/shippingMethod";
export const api_get_shipping_methods = function (data) {
    return http(url_get_shipping_methods, data)
};

export const url_get_channels = "get|delivery/channels";
export const api_get_channels = function (data) {
    return http(url_get_channels, data)
};

export const url_get_accounts = "get|delivery/accounts";
export const api_get_accounts = function (data) {
    return http(url_get_accounts, data)
};

export const url_get_status_count = "get|delivery/orderCounts";
export const api_get_status_count = function (data) {
    return http(url_get_status_count, data)
};

export const url_get_packType = "get|delivery/package-type";
export const api_get_packType = function (data) {
    return http(url_get_packType, data)
};
//产品筛选状态
export const url_get_sku_status = "get|warehouse-goods/sku-status";
export const api_get_sku_status = function (data) {
    return http(url_get_sku_status, data)
};


//新建入库/出库单仓库列表
export const url_stock_in_out_warehouse = "get|warehouse/info";
export const api_stock_in_out_warehouse = function (data) {
    return http(url_stock_in_out_warehouse, data);
};