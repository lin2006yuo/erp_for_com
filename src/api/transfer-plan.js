/**
 * Created by Administrator on 2017/12/6.
 */
import {http} from '../lib/http-plus';
//获取仓库
export const url_warehouse_get = "get|global/warehouse";
export const api_warehouse_get = function (data) {
    return http(url_warehouse_get, data);
};

//调拨入库仓库列表
export const url_in_warehouse_get = "get|warehouse/allocation-list";
export const api_in_warehouse_get = function () {
    return http(url_in_warehouse_get);
};
//获取币种
export const url_get_currency = "get|currency/dictionary";
export const api_get_currency = function (data) {
    return http(Url2(url_get_currency));
};

//新增调拨单
export const url_post_allocation = "post|allocation";
export const api_post_allocation = function (data) {
    return http(Url2(url_post_allocation), data);
};

//调拨单列表
export const url_get_allocation = "get|allocation";
export const api_get_allocation = function (data) {
    return http(Url2(url_get_allocation), data);
};

//状态列表
export const url_get_status = "get|allocation/status-list";
export const api_get_status = function (data) {
    return http(Url2(url_get_status), data);
};

//查看调拨单
export const url_look_allocation = "get|allocation/:id";
export const api_look_allocation = function (id) {
    return http(Url2(url_look_allocation, {id: id}));
};

//修改调拨单运单
export const url_put_waybill = "put|allocation/:id/waybill";
export const api_put_waybill = function (id, data) {
    return http(Url2(url_put_waybill, {id: id}), data);
};

//审核调拨单
export const url_put_audit = "put|allocation/:id/audit";
export const api_put_audit = function (id, data) {
    return http(Url2(url_put_audit, {id: id}), data);
};

//修改调拨单
export const url_put_allocation = "put|allocation/:id";
export const api_put_allocation = function (id, data) {
    return http(Url2(url_put_allocation, {id: id}), data);
};

//生成入库单
export const url_post_entry = "post|allocation/:id/entry";
export const api_post_entry = function (id, data) {
    return http(Url2(url_post_entry, {id: id}), data);
};

//生成出库单
export const url_post_deliver = "post|allocation/:id/deliver";
export const api_post_deliver = function (id, data) {
    return http(Url2(url_post_deliver, {id: id}), data);
};

//新增商品接口
export const url_get_goods = "get|allocation/get-goods";
export const api_get_goods = function (data) {
    return http(Url2(url_get_goods), data);
};

//导入商品
export const url_allocation_import_goods = "post|allocation/import-goods";
export const api_allocation_import_goods = function (data) {
    return http(url_allocation_import_goods, data);
};

//查看箱唛附件信息
export const url_get_allocation_attachment = "get|allocation/:id/get-attachment";
export const api_get_allocation_attachment = function (id) {
    return http(Url2(url_get_allocation_attachment, {id: id}));
};

//上传箱唛附件
export const url_upload_allocation_attachment = "post|allocation/:id/upload-attachment";
export const api_upload_allocation_attachment = function (id, data) {
    return http(Url2(url_upload_allocation_attachment, {id: id}), data);
};

//删除箱唛附件
export const url_delete_allocation_attachment = "post|allocation/:id/delete-attachment";
export const api_delete_allocation_attachment = function (id, data) {
    return http(Url2(url_delete_allocation_attachment, {id: id}), data);
};

//调拨单日志
export const url_allocation_log = "get|allocation/:id/logs";
export const api_allocation_log = function (id) {
    return http(Url2(url_allocation_log, {id: id}));
};