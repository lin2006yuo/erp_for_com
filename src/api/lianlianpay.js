
import {http} from "@/lib/http-plus";

//获取连连列表
export const url_get_lianlianpay = "get|lianlianpay";
export const api_get_lianlianpay = function(data) {
    return http(url_get_lianlianpay, data);
};

//获得站点/账号
export const url_account_list ="get|orders/account";
export const api_account_list = function (data) {
    return http(url_account_list, data);
};

//新增
export const url_lianlianpay_add = "post|lianlianpay/add";
export const api_lianlianpay_add = function(data) {
    return http(url_lianlianpay_add, data);
};

//修改连连账号状态
export const url_lianlianpay_status = "get|lianlianpay/:id/status/:status";
export const api_lianlianpay_status = function(id,status) {
    return http(Url2(url_lianlianpay_status,{id,status}));
};

//编辑连连账号
export const url_lianlianpay_save = "put|lianlianpay/:id/save";
export const api_lianlianpay_save = function(id,data) {
    return http(Url2(url_lianlianpay_save,{id:id}), data);
};

//查看连连账号
export const url_get_lianlianpay_edit = "get|lianlianpay/:id/edit";
export const api_get_lianlianpay_edit = function(id,data) {
    return http(Url2(url_get_lianlianpay_edit,{id:id}), data);
};

//操作人
export const url_user_staffs = "get|user/account/staffs";
export const api_user_staffs = function(data){
    return http(url_user_staffs,data);
};

//账号站点、简称
export const url_channels_account = "get|channels/account";
export const api_channels_account = function(datas){
    return http(url_channels_account, datas);
};