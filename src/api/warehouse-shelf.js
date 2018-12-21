/**
 * Created by Administrator on 2017/10/31.
 */
import {http} from '../lib/http-plus';
//获取货架列表
export const url_warehouse_shelf_lists = "get|warehouse-shelf"
export const warehouse_shelf_lists = function(data){
    return http(url_warehouse_shelf_lists, data);
};
//新增
export const url_add_warehouse_shelf = "post|warehouse-shelf"
export const add_warehouse_shelf = function(data){
    return http(url_add_warehouse_shelf, data);
};
//获取修改信息
export const url_look_warehouse_shelf = "get|warehouse-shelf/:id"
export const api_look_warehouse_shelf= function(id) {
    return http(Url2(url_look_warehouse_shelf, {id:id}));
};
//修改
export const url_edit_warehouse_shelf = "put|warehouse-shelf/:id"
export const api_edit_warehouse_shelf= function(id,data) {
    return http(Url2(url_edit_warehouse_shelf, {id:id}),data);
};
//删除
export const url_delete_warehouse_shelf = "delete|warehouse-shelf/:id"
export const api_delete_warehouse_shelf= function(id) {
    return http(Url2(url_delete_warehouse_shelf, {id:id}));
};
//修改状态
export const url_status_warehouse_shelf = "put|warehouse-shelf/:id/status"
export const api_status_warehouse_shelf= function(id,data) {
    return http(Url2(url_status_warehouse_shelf, {id:id}),data);
};
//修改状态
export const url_warehouse_shelf_face_aisle = "get|warehouse-shelf/face_aisle"
export const api_warehouse_shelf_face_aisle= function(data) {
    return http(url_warehouse_shelf_face_aisle,data,{
        contentType:'application/x-www-form-urlencoded',
            timeout:30000
    });
};
