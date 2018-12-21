/**
 * Created by RondaFul on 2016/10/18.
 */


import {http} from '../lib/http-plus';

export const url_menus = "get|menu/pages"
export const api_menus = function(){
    return http(url_menus);
};
export const url_login_info = "get|login/info"
export const api_login_info = function(){
    return http(url_login_info);
};
export const url_login = "post|login"
export const login = function(data){
    return http(url_login,data);
};
export const url_permission = "get|login/permission"
export const api_permission = function(){
    return http(url_permission);
};
//验证旧密码
export const url_check_password = "post|user/check-password";
export const api_check_password = function(data){
    return http(url_check_password,data);
};


