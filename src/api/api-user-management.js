/**
 * Created by Administrator on 2018/8/20.
 */
import {http} from '../lib/http-plus';

//用户列表获取
export const url_user_list = 'get|virtual-order/user-list';
export const api_user_list = function (data) {
    return http(url_user_list,data)
};
//用户添加
export const url_user_add = 'post|virtual-order/user-add';
export const api_user_add = function (data) {
    return http(url_user_add,data)
};
//获取国家列表
export const url_virtual_country = 'get|virtual-order/country';
export const api_virtual_country = function (data) {
    return http(url_virtual_country,data)
};
//用户编辑
export const url_user_info = 'get|virtual-order/user-info';
export const api_user_info = function (data) {
    return http(url_user_info,data)
};
//用户保存
export const url_user_editor = 'post|virtual-order/user-editor';
export const api_user_editor = function (data) {
    return http(url_user_editor,data)
};
//用户重置密码
export const url_user_save = 'post|virtual-order/user-save';
export const api_user_save = function (data) {
    return http(url_user_save,data)
};
//改变用户状态
export const url_user_statu = 'post|virtual-order/user-status';
export const api_user_statu = function (data) {
    return http(url_user_statu,data)
};
//获取货币类型
export const url_get_currency_type = "get|virtual-user/currency";
export const api_get_currency_type = function(data){
    return http(url_get_currency_type, data);
};