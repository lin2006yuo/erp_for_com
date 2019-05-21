/**
 * Created by wuchuguang on 16-11-16.
 */

import {http} from '../lib/http-plus';

//新增paypal
export const url_add = "post|paypal-account";
export const api_add = function (form) {
    return http(Url2(url_add), form);
};

export const url_get = "get|paypal-account";
export const api_get = function (data) {
    return http(Url2(url_get),data);
};

export const url_info = "get|paypal-account/:id";
export const api_info = function(id){
    return http(Url2(url_info, {id:id}));
};

//查看paypal
export const url_edit = "get|paypal-account/:id/edit";
export const api_edit = function (id) {
    return http(Url2(url_edit, {id:id}));
};

export const url_change_status = "post|paypal-account/status";
export const api_change_status = function (id, newStatus) {
    return http(url_change_status, {id:id, is_invalid:newStatus});
};

//编辑
export const url_upd = "put|paypal-account/:id";
export const api_upd = function (id, form) {
    return http(Url2(url_upd,{id:id}), form);
};

export const test = function () {
    return http('GET',"http://rap.taobao.org/mockjs/10224/fasfasasf");
};

export const url_post_batch_set = "post|paypal-account/batch-set";
export const api_paypal_batch_set = function(data){
    return http(url_post_batch_set,data);
};

//列表授权
export const url_paypal_account_authorization = "put|paypal-account/:id/authorization";
export const api_paypal_account_authorization = (id,param)=>{
    return http(Url2(url_paypal_account_authorization, {id:id}),param);
};

//提款类型
export const url_withdrawals_type = "get|paypal-account/withdrawals-type";
export const api_withdrawals_type = function () {
    return http(url_withdrawals_type);
};

//成员管理
export const url_paypal_account_member = "get|paypal-account/:id/member";
export const api_paypal_account_member = (id,param)=>{
    return http(Url2(url_paypal_account_member, {id:id}),param);
};

//添加成员管理
export const url_post_add_member = "post|paypal-account/add-member";
export const api_paypal_add_member = function(data){
    return http(url_post_add_member,data);
};

//操作人
export const url_user_staffs = "get|user/account/staffs";
export const api_user_staffs = function(data){
    return http(url_user_staffs,data);
};

