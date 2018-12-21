/**
 * Created by Administrator on 2017/8/23.
 */
import {http} from '../lib/http-plus';
//获取账号基础信息列表
export const url_get_account = "get|account-basics";
export const api_get_account = function (data) {
    return http(Url2(url_get_account), data);
};

//获取编辑账号基础信息
export const url_edit_account = "get|account-basics/:id/edit";
export const api_edit_account = function (id) {
    return http(Url2(url_edit_account, {id:id}));
};

//新增账号基础信息
export const url_add_account = "post|account-basics";
export const api_add_account = function (data) {
    return http(Url2(url_add_account), data);
};

//更新账号基础信息
export const url_updata_account = "put|account-basics/:id";
export const api_updata_account = function (id, data) {
    return http(Url2(url_updata_account, {id:id}), data);
};

//更改账号状态
export const url_updata_account_status = "post|account-basics/batch/update";
export const api_updata_account_status = function (data) {
    return http(Url2(url_updata_account_status), data);
};

//获取状态列表
export const url_get_account_status = "get|account-basics/status/info";
export const api_get_account_status = function (data) {
    return http(Url2(url_get_account_status), data);
};

//获取状态btn
export const url_get_account_basics_changes = "get|account-basics/changes";
export const api_get_account_basics_changes = function (data) {
    return http(Url2(url_get_account_basics_changes), data);
};

//获取成员管理信息
export const url_get_account_users = "get|account-users";
export const api_get_account_users = function (data) {
    return http(Url2(url_get_account_users), data);
};

//保存成员管理信息
export const url_post_account_users = "post|account-users";
export const api_post_account_users = function (data) {
    return http(Url2(url_post_account_users), data);
};

//获取密码
export const url_get_password = "get|account-basics/password";
export const api_get_password = function (data) {
    return http(Url2(url_get_password), data);
};

//获取paypal的账号
export const url_get = "get|paypal-account";
export const api_get = function (data) {
    return http(Url2(url_get), data);
};

//获取服务器已绑定的账号列表
export const url_get_already = "get|account-basics/already-bind";
export const api_get_already = function (data) {
    return http(url_get_already, data);
};
// 批量添加、删除账号成员
export const url_account_users_batch = "post|account-users/batch";
export const api_account_users_batch = function (data) {
    return http(url_account_users_batch, data);
};

