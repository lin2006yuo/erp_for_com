/**
 * Created by Administrator on 2017/10/31.
 */
import {http} from '../lib/http-plus';
//获取分区列表
export const url_warehouse_area_lists = "get|warehouse-area/lists"
export const warehouse_area_lists = function(data){
    return http(url_warehouse_area_lists, data);
};
//获取货位类型列表
export const url_warehouse_area_class_lists = "get|warehouse-cargo-class/lists"
export const warehouse_area_class_lists = function(data){
    return http(url_warehouse_area_class_lists, data);
};
//获取货位列表信息
export const url_warehouse_cargo = "get|warehouse-cargo"
export const warehouse_cargo = function(data){
    return http(url_warehouse_cargo, data);
};
//获取货架信息
export const url_warehouse_shelf = "get|warehouse-shelf/lists"
export const warehouse_shelf = function(data){
    return http(url_warehouse_shelf, data);
};
//添加货位
export const url_add_warehouse_cargo = "post|warehouse-cargo"
export const add_warehouse_cargo = function(data){
    return http(url_add_warehouse_cargo, data);
};
//查看
export const url_look_warehouse_cargo = "get|warehouse-cargo/:id"
export const api_look_warehouse_cargo= function(id) {
    return http(Url2(url_look_warehouse_cargo, {id:id}));
};
//更新
export const url_edit_warehouse_cargo = "put|warehouse-cargo/:id"
export const api_edit_warehouse_cargo= function(id,data) {
    return http(Url2(url_edit_warehouse_cargo, {id:id}),data);
};
//删除
export const url_delete_warehouse_cargo = "delete|warehouse-cargo/:id"
export const api_delete_warehouse_cargo= function(id) {
    return http(Url2(url_delete_warehouse_cargo, {id:id}));
};
//批量删除
export const url_more_delete_warehouse_cargo = "delete|warehouse-cargo"
export const api_more_delete_warehouse_cargo= function(data) {
    return http(url_more_delete_warehouse_cargo,data);
};
//导入
export const url_warehouse_cargo_import = "post|warehouse-cargo/import"
export const api_warehouse_cargo_import= function(data) {
    return http(url_warehouse_cargo_import,data);
};
//导出
export const url_warehouse_cargo_export = "post|warehouse-cargo/export"
export const api_warehouse_cargo_export= function(data) {
    return http(url_warehouse_cargo_export,data);
};
//修改状态
export const url_status_warehouse_cargo = "put|warehouse-cargo/:id/status"
export const api_status_warehouse_cargo= function(id,data) {
    return http(Url2(url_status_warehouse_cargo, {id:id}),data);
};
//批量修改状态
export const url_more_status_warehouse_cargo = "put|warehouse-cargo/status"
export const api_more_status_warehouse_cargo = function(data) {
    return http(Url2(url_more_status_warehouse_cargo),data);
};
//获取分区功能list
export const url_warehouse_area_app_types = "get|warehouse-area/types"
export const api_warehouse_area_app_types = function(data) {
    return http(url_warehouse_area_app_types,data);
};
//获取分区管理员list
export const url_warehouse_staffs = "get|user/warehouse/staffs"
export const api_warehouse_staffs = function(data) {
    return http(url_warehouse_staffs,data);
};
//打印货位号
export const url_lable_data = "get|warehouse-cargo/print"
export const api_lable_data = function(data) {
    return http(url_lable_data,data);
};

//手动绑定推荐货位
export const url_get_cargo = "get|warehouse-cargo/recommend"
export const api_get_cargo = function(data) {
    return http(url_get_cargo,data);
};

//自动绑定货位
export const url_bind_cargo = "post|warehouse-cargo-goods/auto-bind"
export const api_bind_cargo = function(data) {
    return http(url_bind_cargo,data);
};

//确认绑定
export const url_post_cargo = "post|warehouse-cargo-goods/bind"
export const api_post_cargo = function(data) {
    return http(url_post_cargo,data);
};
