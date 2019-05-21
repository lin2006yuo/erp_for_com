import {http} from '../lib/http-plus';
export const url_target_department = "get|monthly-target-department";
export const api_target_department = function(data){
    return http(url_target_department, data);
};
//添加部门
export const add_target_department = "post|monthly-target-department";
export const api_add_target_department = function(data){
    return http(add_target_department, data);
};
//更新部门
export const edit_target_department = "put|monthly-target-department/:id";
export const api_edit_target_department = function(id,data){
    return http(Url2(edit_target_department,{id:id}),data);
};
//获取所有部门
export const get_get_gepartment = "get|monthly-target-department/get-department";
export const api_get_get_gepartment = function(data){
    return http(get_get_gepartment,data);
};
//编辑部门 monthly-target-department/1/edit
export const edit_partment_group = "get|monthly-target-department/:id/edit";
export const api_edit_partment_group = function(id){
    return http(Url2(edit_partment_group,{id:id}));
};
//获取销售
export const get_sales_staffs = "get|user/sales/staffs";
export const api_get_sales_staffs = function(){
    return http(get_sales_staffs);
};
//导出部门与成员组成表
export const url_export_target_amount = "post|monthly-target-amount/export";
export const api_export_target_amount = function(){
    return http(url_export_target_amount);
};
//导入考核目标
export const url_import_target_amount = "post|monthly-target-amount/import";
export const api_import_target_amount = function(data){
    return http(url_import_target_amount,data);
};

//保存导入考核目标
export const url_save_import = "post|monthly-target-amount/save-import";
export const api_save_import = function(data){
    return http(url_save_import,data);
};
//成员添加
export const url_add_user = "post|monthly-target-user/add";
export const api_add_user = function(data){
    return http(url_add_user,data);
};
//成员列表
export const url_get_target_user = "get|monthly-target-user";
export const api_get_target_user = function(data){
    return http(url_get_target_user,data);
};
//成员编辑
export const url_edit_target_user = "get|monthly-target-user/:user_id/edit";
export const api_edit_target_user = function(user_id,data){
    return http(Url2(url_edit_target_user,{user_id:user_id}));
};
//成员更新
export const url_update_target_user = "put|monthly-target-user/:id";
export const api_update_target_user = function(id,data){
    return http(Url2(url_update_target_user,{id:id}),data);
};
//月度目标进度报表
export const url_monthly_target_list = "get|monthly-target-amount";
export const api_monthly_target_list = function(data){
    return http(url_monthly_target_list,data);
};
//月度目标批量导出 monthly-target-amount/export-monthly
export const url_export_monthly = "post|monthly-target-amount/export-monthly";
export const api_export_monthly = function(){
    return http(url_export_monthly);
};
//spu月度目标批量导出
export const url_develop_export_monthly = "post|develop-monthly-target-amount/export-monthly";
export const api_develop_export_monthly = function(){
    return http(url_develop_export_monthly);
};
//spu月度目标进度报表
export const url_develop_monthly_target = "get|develop-monthly-target-amount";
export const api_develop_monthly_target = function(data){
    return http(url_develop_monthly_target,data);
};
//spu目标配置
export const url_develop_target_department = "get|develop-monthly-target-department";
export const api_develop_target_department = function(data){
    return http(url_develop_target_department, data);
};
//spu 目标配置 成员列表
export const url_develop_target_user = "get|develop-monthly-target-user";
export const api_develop_target_user = function(data){
    return http(url_develop_target_user,data);
};
//spu 目标配置 更新部门
export const url_update_develop_department = "put|develop-monthly-target-department/:id";
export const api_update_develop_department = function(id,data){
    return http(Url2(url_update_develop_department,{id:id}),data);
};
//spu 目标配置 添加部门
export const url_add_develop_department = "post|develop-monthly-target-department";
export const api_add_develop_department = function(data){
    return http(url_add_develop_department, data);
};
//spu 目标配置 成员添加
export const url_develop_add_user = "post|develop-monthly-target-user/add";
export const api_develop_add_user = function(data){
    return http(url_develop_add_user,data);
};
//spu 目标配置 成员编辑
export const url_develop_edit_user = "get|develop-monthly-target-user/:user_id/edit";
export const api_develop_edit_user = function(user_id,data){
    return http(Url2(url_develop_edit_user,{user_id:user_id}));
};
//spu 目标配置 成员更新
export const url_develop_update_user = "put|develop-monthly-target-user/:id";
export const api_develop_update_user = function(id,data){
    console.log(id,'id');
    return http(Url2(url_develop_update_user,{id:id}),data);
};
//spu 目标配置  导入考核目标
export const url_develop_import_amount = "post|develop-monthly-target-amount/import";
export const api_develop_import_amount = function(data){
    return http(url_develop_import_amount,data);
};
//spu 目标配置 保存导入考核目标
export const url_develop_save_import = "post|develop-monthly-target-amount/save-import";
export const api_develop_save_import = function(data){
    return http(url_develop_save_import,data);
};
//spu 目标配置 编辑部门
export const edit_develop_partment_group = "get|develop-monthly-target-department/:id/edit";
export const api_edit_develop_partment_group = function(id){
    return http(Url2(edit_develop_partment_group,{id:id}));
};
//spu 目标配置 获取所有部门
export const get_develop_gepartment = "get|develop-monthly-target-department/get-department";
export const api_get_develop_gepartment = function(data){
    return http(get_develop_gepartment,data);
};
//spu 目标配置 导出部门与成员组成表
export const url_develop_export_amount = "post|develop-monthly-target-amount/export";
export const api_develop_export_amount = function(){
    return http(url_develop_export_amount);
};
//重算部门人数  ----月度开发进度
export const url_post_recal_people = "post|develop-monthly-target-amount/recalculate";
export const api_post_recal_people = function(){
    return http(url_post_recal_people);
};

//重算部门人数和平台账号数 ----月度目标进度
export const url_post_recal_number = "post|monthly-target-amount/recalculate";
export const api_post_recal_number = function(){
    return http(url_post_recal_number);
};

