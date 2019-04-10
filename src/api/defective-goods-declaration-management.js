import {http} from '../lib/http-plus';

//列表
export const url_get_declare_list = "get|defective-goods-declare";
export const api_get_declare_list = function (data) {
    return http(url_get_declare_list,data)
};

//获取申报状态
export const url_get_declare_status = "get|defective-goods-declare/status";
export const api_get_declare_status = function () {
    return http(url_get_declare_status)
};

//获取申报单详情
export const url_get_declare_details = "get|defective-goods-declare/:id";
export const api_get_declare_details = function (id,data) {
    return http(Url2(url_get_declare_details, {id: id}),data)
};

//获取本地仓
export const url_get_warehous_local = "get|warehouse/local";
export const api_get_warehous_local = function (data) {
    return http(url_get_warehous_local, data);
};

//新增次品申报
export const url_post_add_declare = "post|defective-goods-declare/create";
export const api_post_add_declare = function (data) {
    return http(url_post_add_declare, data);
};

//审核次品申报单
export const url_post_audit_declare = "post|defective-goods-declare/check";
export const api_post_audit_declare = function (data) {
    return http(url_post_audit_declare, data);
};

