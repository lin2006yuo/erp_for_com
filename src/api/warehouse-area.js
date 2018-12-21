/**
 * Created by Administrator on 2017/10/27.
 */
import {http} from '../lib/http-plus';
//列表
export const url_warehouse_area = "get|warehouse-area"
export const warehouse_area = function(data){
    return http(url_warehouse_area, data);
};
//新增
export const url_add_warehouse_area = "post|warehouse-area"
export const add_warehouse_area = function(data){
    return http(url_add_warehouse_area, data);
};
//查看
export const url_look_warehouse_area = "get|warehouse-area/:id"
export const api_look_warehouse_area = function(id) {
    return http(Url2(url_look_warehouse_area, {id:id}));
};
//获取编辑信息
export const url_edit_look_warehouse_area = "get|warehouse-area/:id/edit"
export const api_edit_look_warehouse_area = function(id) {
    return http(Url2(url_edit_look_warehouse_area, {id:id}));
};
//编辑
export const url_edit_warehouse_area = "put|warehouse-area/:id"
export const api_edit_warehouse_area = function(id,data) {
    return http(Url2(url_edit_warehouse_area, {id:id}),data);
};
//删除
export const url_delete_warehouse_area = "delete|warehouse-area/:id"
export const api_delete_warehouse_area = function(id) {
    return http(Url2(url_delete_warehouse_area, {id:id}));
};
//修改状态
export const url_status_warehouse_area = "put|warehouse-area/:id/status"
export const api_status_warehouse_area= function(id,data) {
    return http(Url2(url_status_warehouse_area, {id:id}),data);
};
