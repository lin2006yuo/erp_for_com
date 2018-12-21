import {http} from '../lib/http-plus';
import {url_look_account} from "@/api/pdd";

//平台自动登录列表
export  const url_channel_node = "get|channel-node";
export  const api_channel_node = function (data) {
    return http(url_channel_node,data)
};
//平台自动登录编辑
export  const url_automatic_edit = "get|channel-node/:id/edit";
export  const api_automatic_edit = function (id,data) {
    return http(Url2(url_automatic_edit,{id:id},data));
};
//平台自动登录保存
export  const url_automatic_save = "post|channel-node";
export  const api_automatic_save = function (data) {
    return http(url_automatic_save,data)
};
//平台自动登录更新
export  const url_automatic_update = "put|channel-node/:id";
export  const api_automatic_update = function (id,data) {
    return http(Url2(url_automatic_update,{id:id}),data);
    //return http(url_automatic_update,{id:id})
};
//平台自动登录删除
export const url_delete_action = "delete|channel-node/:id";
export const api_delete_action =function (id) {
    return http(Url2(url_delete_action,{id:id}))
};
//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};
export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};