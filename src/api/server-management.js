/**
 * Created by Administrator on 2017/8/4.
 */
import {http} from '../lib/http-plus';

//获取服务器列表
export const url_get_server = "get|servers";
export const api_get_server = function (data) {
    return http(Url2(url_get_server), data);
};

//新增账号服务器
export const url_add_server = "post|servers";
export const api_add_server = function (data) {
    return http(Url2(url_add_server), data);
};

//编辑账号服务器
export const url_edit_server = "get|servers/:id/edit";
export const api_edit_server = function (id) {
    return http(Url2(url_edit_server, {id:id}));
};

//更新账号服务器
export const url_update_server = "put|servers/:id";
export const api_update_server = function (id, data) {
    return http(Url2(url_update_server, {id:id}), data);
};

//删除账号服务器
export const url_delete_server = "delete|servers/:id";
export const api_delete_server = function (id) {
    return http(Url2(url_delete_server, {id:id}));
};

//获取服务器日志
export const url_get_serverlog = "get|server-logs";
export const api_get_serverlog = function (data) {
    return http(Url2(url_get_serverlog), data);
};

//读取用户授权
export const url_get_serveraccount = "get|servers/authorization-info";
export const api_get_serveraccount = function (data) {
    return http(Url2(url_get_serveraccount), data);
};

//设置用户授权
export const url_post_account = "post|servers/authorization";
export const api_post_account = function (data) {
    return http(Url2(url_post_account), data);
};

//获取用户列表
export const url_get_user = "get|user";
export const api_get_user = function (data) {
    return http(Url2(url_get_user), data);
};

//服务器列表导出
export const url_post_export_server = "post|servers/export";
export const api_post_export_server = function (data) {
    return http(url_post_export_server,data);
};

//服务器成员导出
export const url_post_export_user = "post|servers/export-user";
export const api_post_export_user = function (data) {
    return http(url_post_export_user,data);
};

//批量设置上报周期
export const url_post_reporting_batch = "post|servers/reporting/batch";
export const api_post_reporting_batch = function (data) {
    return http(url_post_reporting_batch,data);
};

//设置服务器状态
export const url_post_servers_status = "post|servers/status";
export const api_post_servers_status = function (data) {
    return http(url_post_servers_status,data);
};

//查看被引用详情
export const url_get_servers_use_info = "get|servers/:id/use-info";
export const api_get_servers_use_info = function (id) {
    return http(Url2(url_get_servers_use_info, {id:id}));
};

//添加成员管理保存
export const url_add_save_user_info = "post|servers/:id/users";
export const api_add_save_user_info = (id,data)=> {
    return http(Url2(url_add_save_user_info, {id:id}),data);
};

//批量删除
export const url_delete_user_info = "delete|servers/:id/user";
export const api_delete_user_info = (id,data)=> {
    return http(Url2(url_delete_user_info, {id:id}),data);
};
//服务器日志
export const url_servers_log = "get|servers/:id/log";
export const api_servers_log = function (data) {
    return http(Url2(url_servers_log,data))
};

//获取操作人部门
export const url_get_user_id_get_department = "get|user/:id/get-department";
export const api_get_user_id_get_department = function (id) {
    return http(Url2(url_get_user_id_get_department,{id}));
};