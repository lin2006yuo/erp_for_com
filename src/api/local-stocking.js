import {http} from '../lib/http-plus';

//获取活动备货列表
export const url_local_stocking = "get|local-stocking";
export const api_local_stocking = function (data) {
    return http(url_local_stocking, data);
};

//获取活动备货状态
export const url_local_stocking_status = "get|local-stocking/status";
export const api_local_stocking_status = function () {
    return http(url_local_stocking_status);
};

// 创建活动备货申请
export const url_local_stocking_create = "post|local-stocking";
export const api_local_stocking_create = function (data) {
    return http(url_local_stocking_create, data);
};

//查看活动备货详情
export const url_local_stocking_detail = "get|local-stocking/:id";
export const api_local_stocking_detail = function (id) {
    return http(Url2(url_local_stocking_detail,{id}));
};

//审核活动备货申请
export const url_local_stocking_adopt = "post|local-stocking/adopt/:id";
export const api_local_stocking_adopt = function (id, data) {
    return http(Url2(url_local_stocking_adopt, {id}), data);
};

//导入活动备货商品
export const url_local_stocking_import_goods = "post|local-stocking/import-goods";
export const api_local_stocking_import_goods = function (data) {
    return http(url_local_stocking_import_goods, data);
};