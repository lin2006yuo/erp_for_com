import {http} from '../lib/http-plus';

import { httpFile } from '../view/base/software-management/request'
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

//获取编辑资源
export const url_get_software_edit = "get|software/:id/edit";
export const api_get_software_edit = function (id) {
    return http(Url2(url_get_software_edit,{id:id}))
};

//编辑修改
export const url_put_software = "put|software/:id";
export const api_put_software = function (id,data) {
    return http(Url2(url_put_software,{id:id}),data)
};


// 上传文件。
export const url_upload_software = "post|software/segment-upload";
export const api_upload_software = function (data, header) {
    return httpFile(url_upload_software, data, header)
};
