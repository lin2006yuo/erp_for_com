import {http} from "@/lib/http-plus";

//获取万里汇账号列表
export const url_get_worldfirst = "get|worldfirst";
export const api_get_worldfirst = function(data) {
    return http(url_get_worldfirst, data);
};

//添加万里汇账号
export const url_worldfirst_add = "post|worldfirst/add";
export const api_worldfirst_add = function(data) {
    return http(url_worldfirst_add, data);
};

//查看万里汇账号
export const url_get_worldfirst_edit = "get|worldfirst/:id/edit";
export const api_get_worldfirst_edit = function(id,data) {
    return http(Url2(url_get_worldfirst_edit,{id:id}), data);
};

//编辑万里汇账号
export const url_worldfirst_save = "put|worldfirst/:id/save";
export const api_worldfirst_save = function(id,data) {
    return http(Url2(url_worldfirst_save,{id:id}), data);
};

//修改万里汇账号状态
export const url_worldfirst_status = "get|worldfirst/:id/status/:status";
export const api_worldfirst_status = function(id,status) {
    return http(Url2(url_worldfirst_status,{id,status}));
};

//获取密码
export const url_get_password = "get|worldfirst/show-pw";
export const api_get_password = function (data) {
    return http(url_get_password,data);
};

//操作人
export const url_user_staffs = "get|user/account/staffs";
export const api_user_staffs = function(data){
    return http(url_user_staffs,data);
};