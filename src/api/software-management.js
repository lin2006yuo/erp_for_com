import {http} from '../lib/http-plus';

//软件管理列表
export const url_get_software_list = "get|software";
export const api_get_software_list = function (data) {
    return http(url_get_software_list,data)
};

//获取类型
export const url_get_software_type = "get|software/type";
export const api_get_software_type = function (data) {
    return http(url_get_software_type,data)
};

//软件管理保存
export const url_post_add_form = "post|software";
export const api_post_add_form = function (data) {
    return http(url_post_add_form,data)
};

//软件管理删除
export const url_post_delete = "delete|software/:id";
export const api_post_delete = function (id,data) {
    return http(Url2(url_post_delete,{id:id}),data)
};

//修改软件管理状态
export const url_post_modify_status = "post|software/:id/status";
export const api_post_modify_status = function (id,data) {
    return http(Url2(url_post_modify_status,{id:id}),data)
};

//发布软件版本
export const url_post_software_version = "post|software/:id/version";
export const api_post_software_version = function (id,data) {
    return http(Url2(url_post_software_version,{id:id}),data)
};

//软件历史记录
export const url_get_software_version = "get|software/:id/version";
export const api_get_software_version = function (id,data) {
    return http(Url2(url_get_software_version,{id:id}),data)
};