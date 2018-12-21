import {http} from '../lib/http-plus';
export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function(){
    return http(url_entrepot_picking)
};

//获取上架区
export const url_get_area = "get|warehouse-area/lists";
export const api_get_area = function(data){
    return http(url_get_area,data)
};

//获取待上架列表
export const url_get_goods = "get|putaway-waiting-goods";
export const api_get_goods = function(data){
    return http(url_get_goods,data)
};

//获取状态列表
export const url_get_status = "get|putaway-waiting-goods/status";
export const api_get_status = function(data){
    return http(url_get_status,data)
};

//获取仓库区域类型
export const url_get_areatype = "get|putaway-waiting-goods/warehouseAreaTypes";
export const api_get_areatype = function(data){
    return http(url_get_areatype,data)
};

//直接上架
export const url_putaway_create = "post|putaway-waiting-goods/batch/update";
export const api_putaway_create = function(data){
    return http(url_putaway_create,data)
};
