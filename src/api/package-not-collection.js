//获取仓库
import {http} from "../lib/http-plus";

export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function(){
    return http(url_entrepot_picking)
};

//物流信息
export const url_get_shipping = "get|package-not-collection/shipping";
export const api_get_shipping = function(data){
    return http(url_get_shipping, data)
};

//获取列表
export const url_get_collection = "get|package-not-collection";
export const api_get_collection = function(data){
    return http(url_get_collection, data)
};

//打印包裹
export const url_print_package = "post|delivery-check/:package_id/print";
export const api_print_package = function (package_id,data){
    return http(Url2(url_print_package, {package_id: package_id}), data)
};

//释放包裹
export const url_package_not_collection_back = "post|package-not-collection/back";
export const api_package_not_collection_back = function(data){
    return http(url_package_not_collection_back, data);
};

//执行发货
export const url_send_goods = "post|package-collection/self-do";
export const api_send_goods = function (data) {
    return http(url_send_goods, data);
};
//加入异常
export const url_add_problem = "post|package-collection/add-problem";
export const api_add_problem = function (data) {
    return http(url_add_problem, data);
};
//超尺寸异常
export const url_add_size_problem = "post|package-collection/add-size-problem ";
export const api_add_size_problem = function (data) {
    return http(url_add_size_problem, data)
}

