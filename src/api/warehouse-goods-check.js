import {http} from '../lib/http-plus';
//获取状态列表
export const url_get_status = "get|warehouse-goods-check/status";
export const api_get_status = function(data){
    return http(url_get_status, data);
};
//获取盘点列表
export const url_warehouse_goods_check = "get|warehouse-goods-check";
export const api_warehouse_goods_check = function(data){
    return http(url_warehouse_goods_check, data);
};

//新增盘点单
export const url_warehouse_goods_check_create = "post|warehouse-goods-check/create";
export const api_warehouse_goods_check_create = function(data){
    return http(url_warehouse_goods_check_create, data);
};

//获取分类列表
export const url_get_categories = "get|categories";
export const api_get_categories = function(){
    return http(url_get_categories);
};

//获取仓库
export const url_warehouse_get = "get|global/warehouse";
export const api_warehouse_get = function(data){
    return http(url_warehouse_get,data);
};

//查看盘点单
export const url_get_detail = "get|warehouse-goods-check/:id";
export const api_get_detail = function(id){
    return http(Url2(url_get_detail, {id:id}));
};

//完成盘点单
export const url_finish_detail = "get|warehouse-goods-check/finish/:id";
export const api_finish_detail = function(id){
    return http(Url2(url_finish_detail, {id:id}));
};

//获取仓库人员
export const url_get_warehouse_user = "get|user/warehouse/staffs";
export const api_get_warehouse_user = function(id){
    return http(Url2(url_get_warehouse_user, {id:id}));
};

//获取仓库货位库存
export const url_get_cargo = "get|warehouse-cargo-goods";
export const api_get_cargo = function(data){
    return http(Url2(url_get_cargo), data);
};

//获取分区功能
export const url_get_area_type = "get|warehouse-area/types";
export const api_get_area_type = function(id){
    return http(Url2(url_get_area_type, {id:id}));
};

//获取分区
export const url_get_area_lists = "get|warehouse-area/lists";
export const api_get_area_lists = function(data){
    return http(Url2(url_get_area_lists), data);
};

//单个盘点单盘点
export const url_save_check = "post|warehouse-goods-check/save";
export const api_save_check = function(data){
    return http(Url2(url_save_check), data);
};

//批量盘点单保存
export const url_save_batch_check = "post|warehouse-goods-check/batch/save";
export const api_save_batch_check = function(data){
    return http(Url2(url_save_batch_check), data);
};

//作废盘点单
export const url_cancels_check = "delete|warehouse-goods-check/cancels/:id";
export const api_cancels_check = function(id){
    return http(Url2(url_cancels_check, {id:id}));
};

//删除盘点单
export const url_delete_check = "delete|warehouse-goods-check/deletes/:id";
export const api_delete_check = function(id){
    return http(Url2(url_delete_check, {id:id}));
};

//编辑盘点单
export const url_update_check = "post|warehouse-goods-check/updates";
export const api_update_check = function(data){
    return http(Url2(url_update_check), data);
};

//删除盘点单
export const url_delete_details = "post|warehouse-goods-check/delete-details";
export const api_delete_details = function(data){
    return http(Url2(url_delete_details), data);
};

//重盘条目
export const url_recheck_details = "put|warehouse-goods-check/recheck/:id";
export const api_recheck_details = function(id){
    return http(Url2(url_recheck_details, {id:id}));
};

