/**
 * Created by RondaFul on 2017/4/5.
 */
import {http} from '../lib/http-plus';

//获取平台
export const url_reply_channel ="get|channel-categories";
export const api_reply_channel = function() {
    return http(Url2(url_reply_channel));
};
//获取模板类型
export const url_reply_types ="get|msg-tpl/getTypes";
export const api_reply_types = function() {
    return http(Url2(url_reply_types));
};
//获取分组id
export const url_reply_team ="get|msg-tpl-group";
export const api_reply_team = function(data) {
    return http(Url2(url_reply_team),data);
};
//获取列表
export const url_reply_list ="get|msg-tpl";
export const api_reply_list = function(data) {
    return http(Url2(url_reply_list),data);
};
//新增回复模板
export const url_add_reply ="post|msg-tpl";
export const api_add_reply = function(data) {
    return http(Url2(url_add_reply),data);
};
//编辑回复模板
export const url_edit_reply ="get|msg-tpl/:id/edit";
export const api_edit_reply = function(id) {
    return http(Url2(url_edit_reply,{id:id}));
};
//更新回复模板
export const url_update_reply ="put|msg-tpl/:id";
export const api_update_reply = function(id,data) {
    return http(Url2(url_update_reply,{id:id}),data);
};
//删除回复模板
export const url_del_reply ="delete|msg-tpl/:id";
export const api_del_reply = function(id) {
    return http(Url2(url_del_reply,{id:id}));
};
//新增模板分组
export const url_add_template ="post|msg-tpl-group";
export const api_add_template = function(data) {
    return http(Url2(url_add_template),data);
};
//编辑模板分组
export const url_edit_template ="get|msg-tpl-group/:id/edit";
export const api_edit_template = function(id) {
    return http(Url2(url_edit_template,{id:id}));
};
//更新模板分组
export const url_update_template ="put|msg-tpl-group/:id";
export const api_update_template = function(id,data) {
    return http(Url2(url_update_template,{id:id}),data);
};
//删除模板
export const url_del_template="delete|msg-tpl-group/:id";
export const api_del_template = function(id) {
    return http(Url2(url_del_template,{id:id}));
};
//获取数据字段
export const url_reply_field ="get|msg-tpl/getFields";
export const api_reply_field = function(data) {
    return http(Url2(url_reply_field),data);
};
//批量删除
export const url_all_del ="post|msg-tpl/batch/delete";
export const api_all_del = function(data) {
    return http(Url2(url_all_del),data);
};
