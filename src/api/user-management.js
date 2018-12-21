/**
 * Created by user on 2016/12/26.
 */
import {http} from '../lib/http-plus';

//用户列表
export const url_user_list = "get|user"
export const api_user_list = function(data){
    return http(url_user_list,data);
};
//添加用户
export const url_add_user = "post|user"
export const api_add_user = function(data){
    return http(url_add_user,data);
};
//删除
export const url_delete = "delete|user/:id"
export const api_delete = function(id){
    return http(Url2(url_delete,{id:id}));
};

//查看
export const url_look_over = "get|user/:id"
export const api_look_over = function(id){
    return http(Url2(url_look_over,{id:id}));
};
//获取部门和角色
export const url_department_role = "get|user/departmentAndRole"
export const api_department_role = function(data){
    return http(url_department_role,data);
};
//获取部门
export const url_department = "get|department"
export const api_get_department = function(data){
    return http(url_department,data);
};

//更新
export const url_update = "put|user/:id"
export const api_update = function(id,data){
    return http(Url2(url_update,{id:id}),data);
};
//更改密码
export const url_change_pwd = "post|user/:id/reset-password";
export const api_change_pwd = function(id){
    return http(Url2(url_change_pwd,{id:id}));
};
//修改密码
export const url_update_password = "post|user/updatePassword";
export const api_update_password = function(data){
    return http(url_update_password,data);
};
//批量停用
export const url_batch_change_status = "post|user/batch";
export const api_batch_change_status = function(data){
    return http(url_batch_change_status,data);
};
//更改状态
export const url_change_status = "get|user/status"
export const api_change_status = function(data){
    return http(url_change_status,data);
};

//获取部门代码
export const url_get_department = "get|job";
export const api_department_code = function(data){
    return http(url_get_department,data);
};

