/**
 * Created by Administrator on 2017/10/30.
 */
import {http} from '../lib/http-plus';
//列表
export const url_warehouse_cargo_class = "get|warehouse-cargo-class"
export const warehouse_cargo_class = function(data){
    return http(url_warehouse_cargo_class, data);
};
//新增
export const url_add_warehouse_cargo_class = "post|warehouse-cargo-class"
export const add_warehouse_cargo_class = function(data){
    return http(url_add_warehouse_cargo_class, data);
};
//查看 获取编辑信息
export const url_look_warehouse_cargo_class = "get|warehouse-cargo-class/:id"
export const api_look_warehouse_cargo_class = function(id) {
    return http(Url2(url_look_warehouse_cargo_class, {id:id}));
};
//启用停用信息
export const url_status_warehouse_cargo_class = "put|warehouse-cargo-class/:id/status"
export const api_status_warehouse_cargo_class = function(id,data) {
    return http(Url2(url_status_warehouse_cargo_class, {id:id}),data);
};

//编辑
export const url_edit_warehouse_cargo_class = "put|warehouse-cargo-class/:id"
export const api_edit_warehouse_cargo_class = function(id,data) {
    return http(Url2(url_edit_warehouse_cargo_class, {id:id}),data);
};
//删除
export const url_delete_warehouse_cargo_class = "delete|warehouse-cargo-class/:id"
export const api_delete_warehouse_cargo_class = function(id) {
    return http(Url2(url_delete_warehouse_cargo_class, {id:id}));
};
