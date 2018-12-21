/**
 * Created by alison on 16-11-14.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

// 1.1  aliexpress账号列表
export const url_aliexpress_account = 'get|aliexpress-account';
export const aliexpress_account = function (data) {
    return http(url_aliexpress_account, data)
}

// 1.2  编辑aliexpress账号信息
export const url_aliexpress_edit = 'get|aliexpress-account/:id/edit';
export const aliexpress_edit = function (id) {
    return http(Url2(url_aliexpress_edit, {id: id}))
}

// 1.3  更新aliexpress账号
export const url_aliexpress_update = 'put|aliexpress-account/:id';
export const aliexpress_update = function (id, data) {
    return http(Url2(url_aliexpress_update, {id: id}), data)
}

// 1.4  查看aliexpress账号信息
export const url_aliexpress_lookover = 'get|aliexpress-account/:id';
export const aliexpress_lookover = function (id) {
    return http(Url2(url_aliexpress_lookover,{id:id}))
}

//1.5  获取aliexpress授权页面信息
export const url_aliexpress_accredit = 'post|aliexpress-account/authorization';
export const aliexpress_accredit = function (id) {
    return http(url_aliexpress_accredit, {id: id})
}

// 1.6  获取aliexpress账号token
export const url_aliexpress_getToken = 'post|aliexpress-account/getToken';
export const aliexpress_getToken = function (data) {
    return http(url_aliexpress_getToken,data)
}

// 1.7  获取aliexpress账号token
export const url_aliexpress_getCode = 'post|aliexpress-account/getAuthorCode/';
export const aliexpress_getCode = function (client_id, client_secret) {
    return http(url_aliexpress_getCode, {client_id: client_id, client_secret: client_secret})
}
// 1.8  添加aliexpress账号
export const url_aliexpress_add = 'post|aliexpress-account';
export const aliexpress_add = function (data) {
    return http(url_aliexpress_add, data);
}
// 1.9  启用/停用aliexpress账号
export const url_aliexpress_states = 'post|aliexpress-account/states';
export const aliexpress_states = function (id, is_invalid) {
    return http(url_aliexpress_states, {id: id, is_invalid: is_invalid});
}
//添加成员
export const url_add_member = "get|member-ship/memberInfo";
export const api_add_member = function (data) {
    return http(url_add_member,data)
}
//通知
export const url_get_topic_list = "get|aliexpress-account/topic";
export const api_get_topic_list = function (data) {
    return http(url_get_topic_list,data)
};
//aliexpress为已授权的用户开通消息服务 http://api.rondaful.com/aliexpress-account/user-permit?account_id=34&topics_id=1,3,4
export const url_post_user_permit = "get|aliexpress-account/user-permit";
export const api_post_user_permit = function (data) {
    return http(url_post_user_permit,data)
};
//批量设置
export const url_post_user_update = "post|aliexpress-account/batch-update";
export const api_post_user_update = function (data) {
    return http(url_post_user_update,data)
};
