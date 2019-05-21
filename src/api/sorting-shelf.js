/**
 * Created by Administrator on 2017/11/9.
 */
import {http} from '../lib/http-plus';

export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function(){
    return http(url_entrepot_picking)
};

//获取播种车列表
export const url_get_shelf = "get|sorting-shelf";
export const api_get_shelf = function(data){
    return http(url_get_shelf, data)
};

//添加播种车
export const url_add_shelf = "post|sorting-shelf";
export const api_add_shelf = function(data){
    return http(url_add_shelf, data)
};

//编辑播种车
export const url_edit_shelf = "get|sorting-shelf/:id";
export const api_edit_shelf = function(id){
    return http(Url2(url_edit_shelf, {id:id}))
};

//删除播种车
export const url_delete_shelf = "delete|sorting-shelf/:id";
export const api_delete_shelf = function(id){
    return http(Url2(url_delete_shelf, {id:id}))
};

//启用/停用播种车
export const url_change_status = "put|sorting-shelf/:id/status";
export const api_change_status = function(id, data){
    return http(Url2(url_change_status, {id:id}), data)
};

//更新播种车
export const url_update_shelf = "put|sorting-shelf/:id";
export const api_update_shelf = function(id, data){
    return http(Url2(url_update_shelf, {id:id}), data);
};
