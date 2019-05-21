/**
 * Created by Administrator on 2017/11/15.
 */
import {http} from '../lib/http-plus';
export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function(){
    return http(url_entrepot_picking)
};

//新增集结区
export const url_add_mass = "post|mass-zone";
export const api_add_mass = function(data){
    return http(url_add_mass, data)
};

//获取集结区列表
export const url_get_mass = "get|mass-zone";
export const api_get_mass = function(data){
    return http(url_get_mass, data)
};

//删除集结区
export const url_delete_mass = "delete|mass-zone/:id";
export const api_delete_mass = function(id){
    return http(Url2(url_delete_mass, {id:id}))
};
