import {http} from '../lib/http-plus';

//获取拣货单状态列表
export const url_allocation_pickings_status = "get|pickings-manage/status";
export const api_allocation_pickings_status = function () {
    return http(url_allocation_pickings_status);
};

//调拨拣货单列表
export const url_allocation_pickings = "get|pickings-manage";
export const api_allocation_pickings = function (data) {
    return http(url_allocation_pickings, data);
};

//查看拣货单
export const url_look_allocation_picking = "get|pickings-manage/:id";
export const api_look_allocation_picking = function (id) {
    return http(Url2(url_look_allocation_picking, {id}));
};

//拣货单商品信息
export const url_allocation_picking_detail = "get|pickings-manage/:id/detail";
export const api_allocation_picking_detail = function (id, data) {
    return http(Url2(url_allocation_picking_detail, {id}), data);
};

//拣货单周转箱
export const url_allocation_picking_turnover = "get|pickings-manage/:id/turnover";
export const api_allocation_picking_turnover = function (id) {
    return http(Url2(url_allocation_picking_turnover, {id}));
};

//标记为正在拣货
export const url_allocation_picking_mark = "post|pickings-manage/:id/marking";
export const api_allocation_picking_mark = function (id) {
    return http(Url2(url_allocation_picking_mark, {id}));
};

//打印拣货单数据
export const url_allocation_picking_print = "get|pickings-manage/:id/print";
export const api_allocation_picking_print = function (id) {
    return http(Url2(url_allocation_picking_print, {id}));
};

//拣货单操作日志
export const url_allocation_picking_log = "get|pickings-manage/:id/log";
export const api_allocation_picking_log = function (id, data) {
    return http(Url2(url_allocation_picking_log, {id}), data);
};

//作废拣货单
export const url_allocation_picking_invalid = "post|pickings-manage/:id/invalid";
export const api_allocation_picking_invalid = function (id, data) {
    return http(Url2(url_allocation_picking_invalid, {id}), data);
};

//下架拣货单
export const url_allocation_picking_complete = "post|pickings-manage/:id/complete";
export const api_allocation_picking_complete = function (id, data) {
    return http(Url2(url_allocation_picking_complete, {id}), data);
};

//打印商品条码
export const url_allocation_picking_barcode = "get|pickings-manage/:id/print-barcode";
export const api_allocation_picking_barcode = function (id) {
    return http(Url2(url_allocation_picking_barcode, {id}));
};