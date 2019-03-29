/**
 * Created by RondaFul on 2017/5/11.
 */
import {http} from '../lib/http-plus';

//人员列表
export const url_member_list = "get|member-ship"
export const api_member_list = function(data){
  return http(url_member_list, data);
};

export const url_channels = "get|global/channels"
export const api_channels = function(){
  return http(url_channels);
};

export const url_product_account = "get|orders/account"
export const api_product_account = function(data){
  return http(url_product_account, data);
};

//新增加人员
export const url_member_add = "post|member-ship"
export const api_member_add = function(data){
  return http(url_member_add, data);
};

//编辑
export const url_member_edit = "get|member-ship/:id/edit"
export const api_member_edit = function(id){
  return http(Url2(url_member_edit,{id:id}));
};

//查看
export const url_member_look = "get|member-ship/:id"
export const api_member_look = function(id){
  return http(Url2(url_member_look,{id:id}));
};

//更新
export const url_member_update = "put|member-ship/:id"
export const api_member_update = function(id,data){
  return http(Url2(url_member_update,{id:id}),data);
};

//添加
export const url_add_member = "post|member-ship"
export const api_add_member = function(data){
  return http(url_add_member, data);
};

//删除
export const url_member_del = "delete|member-ship/:id"
export const api_member_del = function(id){
  return http(Url2(url_member_del,{id:id}));

};

//批量删除
export const url_member_batch = "post|member-ship/batch/delete"
export const api_member_batch = function(data){
  return http(url_member_batch, data);
};

//全部导出
export const url_export_member_ship_data = "get|member-ship/download";
export const api_export_member_ship_data = function () {
    return http(url_export_member_ship_data);
};

//批量更新
export const url_member_batch_update = "post|member-ship/batch/update"
export const api_member_batch_update = function(data){
    return http(url_member_batch_update, data);
};
// 日志 
export const url_member_ship_log = "get|member-ship/log"
export const api_member_ship_log = function(data){
  return http(url_member_ship_log, data);
}; 
//人员部门
export const url_member_ship_department = "get|user/:id/get-department"
export const api_member_ship_department = function(id){
  return http(Url2(url_member_ship_department,{id:id}));
};
//成员管理
export const url_channel_user_account = "get|member-ship/channel-user-account"
export const api_channel_user_account = function(data){
    return http(url_channel_user_account, data);
};
// 批量添加、删除账号成员
export const url_ship_add_account = "post|member-ship/add-account";
export const api_ship_add_account = function (data) {
    return http(url_ship_add_account, data);
};
//获取平台店铺信息
export const url_get_shop = "get|orders/shop";
export const api_get_shop = function (data) {
    return http(url_get_shop,data);
};