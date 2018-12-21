/**
 * Created by RondaFul on 2017/3/6.
 */
import {http} from '../lib/http-plus';
//请求列表
export const url_product_list = "get|developers";
export const api_product_list = function(data) {
    return http(Url2(url_product_list), data);
};
//查看分组信息
export const url_product_look = "get|developers/:id";
export const api_product_look = function(id) {
    return http(Url2(url_product_look, {id:id}));
};
//编辑分组信息
export const url_product_edit = "get|developers/:id/edit";
export const api_product_edit = function(id) {
    return http(Url2(url_product_edit, {id:id}));
};
//新增分组信息
export const url_product_add = "post|developers";
export const api_product_add= function(data) {
    return http(Url2(url_product_add), data);
};
//更新分组信息
export const url_product_update= "put|developers/:id";
export const api_product_update  = function(id,data) {
    return http(Url2(url_product_update , {id:id}),data);
};
//删除分组信息
export const url_product_del = "delete|developers/:id";
export const api_product_del = function(id) {
    return http(Url2(url_product_del, {id:id}));
};
//获取人员信息
export const url_product_person = "get|user/:type/staffs";
export const api_product_person = function(data) {
    return http(Url2(url_product_person, {type:data.type}),data.data);
};
//获取平台信息
export const url_product_channel = "get|global/channels";
export const api_product_channel = function() {
    return http(Url2(url_product_channel));
};

export const api_product_companys = function(){
    return http('get|company');
};

//获取账号信息
export const url_product_account = "get|channels/:id/accounts";
export const api_product_account = function(id,data) {
    return http(Url2(url_product_account, {id:id}),data);
};
//分类信息
export const url_product_category = "get|developers/categories";
export const api_product_category = function(data) {
    return http(Url2(url_product_category), data);
};
//批量删除
export const url_product_batch = "post|/developers/batch/delete";
export const api_product_batch = function(data) {
    return http(Url2(url_product_batch),data);
};