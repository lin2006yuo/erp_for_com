
import {http} from "@/lib/http-plus";

//获取P卡列表
export const url_get_payoneer = "get|payoneer";
export const api_get_payoneer = function(data) {
    return http(url_get_payoneer, data);
};

//修改P卡状态
export const url_payoneer_status = "get|payoneer/:id/status/:status";
export const api_payoneer_status = function(id,status) {
    return http(Url2(url_payoneer_status,{id,status}));
};

//新增P卡
export const url_payoneer_add = "post|payoneer/add";
export const api_payoneer_add = function(data) {
    return http(url_payoneer_add, data);
};

//查看P卡
export const url_get_payoneer_edit = "get|payoneer/:id/edit";
export const api_get_payoneer_edit = function(id,data) {
    return http(Url2(url_get_payoneer_edit,{id:id}), data);
};

//编辑P卡
export const url_payoneer_save = "put|payoneer/:id/save";
export const api_payoneer_save = function(id,data) {
    return http(Url2(url_payoneer_save,{id:id}), data);
};

//获取密码
export const url_get_password = "get|payoneer/show-pw";
export const api_get_password = function (data) {
    return http(url_get_password,data);
};

//操作人
export const url_user_staffs = "get|user/account/staffs";
export const api_user_staffs = function(data){
    return http(url_user_staffs,data);
};