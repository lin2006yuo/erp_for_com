import {http} from "@/lib/http-plus";

//创建卡板号
export const url_new_parcel_box = "post|purchase-parcels-box";
export const api_new_parcel_box = function () {
    return http(url_new_parcel_box);
};

//结束卡板
export const url_end_parcel_box = "put|purchase-parcels-box/:id";
export const api_end_parcel_box = function (id) {
    return http(Url2(url_end_parcel_box, {id: id}));
};

//批量打板完成
export const url_parcel_box_batch_finish = "put|purchase-parcels-box/batch/finish";
export const api_parcel_box_batch_finish = function (data) {
    return http(url_parcel_box_batch_finish, data);
};

//获取卡板列表
export const url_get_parcel_box = "get|purchase-parcels-box";
export const api_get_parcel_box = function (data) {
    return http(url_get_parcel_box, data);
};

//卡板日志
export const url_parcel_box_log = "get|purchase-parcels-box/:id/log";
export const api_parcel_box_log = function (id) {
    return http(Url2(url_parcel_box_log, {id: id}));
};

//卡板详情
export const url_parcel_box_detail = "get|purchase-parcels-box/:id/parcel";
export const api_parcel_box_detail = function (id) {
    return http(Url2(url_parcel_box_detail, {id: id}));
};

//卡板状态
export const url_parcel_box_status = "get|purchase-parcel-box/status";
export const api_parcel_box_status = function () {
    return http(url_parcel_box_status);
};

//批量删除卡板
export const url_parcel_box_batch_delete = "delete|purchase-parcels-box/batch";
export const api_parcel_box_batch_delete = function (data) {
    return http(url_parcel_box_batch_delete, data);
};

//批量打印卡板标签
export const url_parcel_box_batch_print = "post|purchase-parcels-box/batch/print";
export const api_parcel_box_batch_print = function (data) {
    return http(url_parcel_box_batch_print, data);
};

//卡板打板完成转为拆包状态
export const url_box_transfer = "put|purchase-parcels-box/:id/scanning";
export const api_box_transfer = function (id) {
    return http(Url2(url_box_transfer, {id: id}));
};

//卡板是否拆板完成
export const url_box_unpacked = "put|purchase-parcels-box/:id/unpacked";
export const api_box_unpacked = function (id) {
    return http(Url2(url_box_unpacked, {id: id}))
};

//拆包员列表
export const url_box_unpack_name_list = "get|purchase-parcels-box/unpack-name";
export const api_box_unpack_name_list = function () {
    return http(url_box_unpack_name_list);
};

//批量拆板完成
export const url_box_batch_force = "put|purchase-parcels-box/batch/force";
export const api_box_batch_force = function (data) {
    return http(url_box_batch_force, data);
};