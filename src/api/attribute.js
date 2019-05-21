/**
 * Created by Administrator on 2016/10/27.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';
export const del = function (id) {
    return http('PUT',obj2geturl(url_attribute_add, {id:id}), data);
};

export const url_attribute_list = "get|attributes";
export const attribute_list = function(data) {
    return http(url_attribute_list, data);
};

export const url_attribute_add = "post|attributes";
export const add = function(data) {
    return http(url_attribute_add,data);
};

export const url_attribute_edit = "get|attributes/:id/edit";
export const attribute_edit = function(id) {
    return http(Url2(url_attribute_edit,{id:id}));
};

export const url_attribute_update = "put|attributes/:id";
export const attribute_update= function(id,data) {
    return http(Url2(url_attribute_update, {id:id}),data);
};
export const url_attribute_del = "delete|attributes/:id";
export const attribute_del = function(id) {
    return http(Url2(url_attribute_del, {id:id}));
};
export const url_get_attribute_dict = "get|attribute/dictionary";
export const api_get_attribute_dict = function (data) {
    return http(url_get_attribute_dict,data);
};
export const url_get_attribute_code = "get|attribute/code";
export const api_get_attribute_code = function () {
    return http(url_get_attribute_code);
};
export const url_get_attribute_value = "get|attribute/getAttributeValue/:id";
export const api_get_attribute_value = function (id) {
    return http(Url2(url_get_attribute_value, {id:id}));
};

export const url_attribute_sorts = "put|attribute/sorts";
export const api_attribute_sorts = function (data) {
    return http(url_attribute_sorts,data);
};
