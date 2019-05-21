import {http} from '../lib/http-plus';

//列表
export const url_get_address_list = "get|shipping-address";
export const api_get_address_list = function (data) {
    return http(url_get_address_list,data)
};

//新增地址
export const url_post_add_address = "post|shipping-address";
export const api_post_add_address = function (data) {
    return http(url_post_add_address,data)
};

//修改地址
export const url_put_modify_address = "put|shipping-address/:id";
export const api_put_modify_address = function(id, data){
    return http(Url2(url_put_modify_address,{id:id}), data)
};

//查看地址
export const url_get_address_detail = "get|shipping-address/:id";
export const api_get_address_detail = function (id, data) {
    return http(Url2(url_get_address_detail, {id: id}),data)
};

//删除地址
export const url_delete_address = "delete|shipping-address/:id";
export const api_delete_address = function (id, data) {
    return http(Url2(url_delete_address, {id: id}),data)
};