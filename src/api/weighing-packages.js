/**
 * Created by Administrator on 2017/11/24.
 */
import {http} from '../lib/http-plus';
//获取修改信息
export const url_save_collection = "post|package-collection/set-weight";
export const api_save_collection = function(data) {
    return http(Url2(url_save_collection),data);
};

//获取仓库
export const url_get_warehouse = "get|delivery/getWarehouseChannel";
export const api_get_warehouse = function(){
    return http(url_get_warehouse)
};

//获取供应商接口
export const url_get_shipping = "get|shipping-method/lists";
export const api_get_shipping = function(data){
    return http(url_get_shipping, data)
};

//获取邮寄方式
export const url_package_shipping = "get|package-collection/shipping";
export const api_package_shipping = function(data){
    return http(url_package_shipping, data)
};

export const url_label_edit = "get|label/:id";
export const api_label_edit = function (id) {
    return http(Url2(url_label_edit,{id:id}));
};
//集包完成
export const url_package_collection = "get|package-collection/:id";
export const api_package_collection = function (id, data) {
    return http(Url2(url_package_collection, { id: id }), data);
};

//弹框确认完成
export const url_query_collection = "put|package-collection/:id";
export const api_query_collection = function (id, data) {
    return http(Url2(url_query_collection,{id:id}), data);
};

//获取集结包类型
export const url_get_type = "get|package-collection/type-list";
export const api_get_type = function (data) {
    return http(Url2(url_get_type), data);
};

//移除包裹
export const url_delete_package= "delete|package-collection/package/:id";
export const api_delete_package = function(id){
    return http(Url2(url_delete_package, {id:id}))
};

//添加渠道勾选继续集包
export const url_history_package= "get|package-collection/history-collection";
export const api_history_package = function(data){
    return http(Url2(url_history_package), data);
};

//合并渠道
export const url_combination_shipping = "get|package-collection/add-package";
export const api_combination_shipping = function (data) {
    return http(Url2(url_combination_shipping), data);
}