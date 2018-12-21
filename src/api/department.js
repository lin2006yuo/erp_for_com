/**
 * Created by RondaFul on 2016/12/27.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';
export const url_depart_list = "get|department";
export const depart_list = function(data) {
    return http(url_depart_list, data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:60000
    });
};
export const url_depart_getDepartment = "get|department/getDepartment";
export const depart_getDepartment = function() {
    return http(url_depart_getDepartment);
};
export const url_depart_getUser = "get|department/getUser";
export const depart_getUser = function(data) {
    return http(url_depart_getUser,data);
};
export const url_depart_add = "post|department";
export const depart_add = function(data) {
    return http(url_depart_add,data);
};
export const url_depart_edit = "get|department/:id/edit";
export const depart_edit = function(id) {
    return http(Url2(url_depart_edit,{id:id}));
};
export const url_depart_check = "get|department/:id";
export const depart_check = function(id) {
    return http(Url2(url_depart_check,{id:id}));
};
export const url_depart_status = "get|department/changeStatus";
export const depart_status = function(data) {
    return http(url_depart_status,data);
};
export const url_depart_del = "delete|department/:id";
export const depart_del = function(id) {
    return http(Url2(url_depart_del,{id:id}));
};
export const url_depart_update = "put|department/:id";
export const depart_update = function(id,data) {
    return http(Url2(url_depart_update,{id:id}),data);
};
// //获取部门代码
// export const url_depart_code = "get|department-code";
// export const depart_code = function() {
//     return http(url_depart_code);
// };
//获取职务职位信息
export const url_job_code = "get|job";
export const api_job_code = function(data) {
    return http(url_job_code,data);
};

//部门之间的排序保存
export const url_department_sort = "post|department/sort";
export const api_department_sort = function(data) {
    return http(url_department_sort,data);
};
//获取部门类型
export const url_department_type = "get|department/type";
export const api_department_type = function(data) {
    return http(url_department_type,data);
};

