
import {http} from "@/lib/http-plus";

//获取PingPong列表
export const url_get_pingpong = "get|pingpong";
export const api_get_pingpong = function(data) {
    return http(url_get_pingpong, data);
};

//获得站点/账号
export const url_account_list ="get|orders/account";
export const api_account_list = function (data) {
    return http(url_account_list, data);
};

//新增
export const url_pingpong_add = "post|pingpong/add";
export const api_pingpong_add = function(data) {
    return http(url_pingpong_add, data);
};

//修改pingpong账号状态
export const url_pingpong_status = "get|pingpong/:id/status/:status";
export const api_pingpong_status = function(id,status) {
    return http(Url2(url_pingpong_status,{id,status}));
};

//编辑pingpong账号
export const url_pingpong_save = "put|pingpong/:id/save";
export const api_pingpong_save = function(id,data) {
    return http(Url2(url_pingpong_save,{id:id}), data);
};

//查看PingPong账号
export const url_get_pingpong_edit = "get|pingpong/:id/edit";
export const api_get_pingpong_edit = function(id,data) {
    return http(Url2(url_get_pingpong_edit,{id:id}), data);
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