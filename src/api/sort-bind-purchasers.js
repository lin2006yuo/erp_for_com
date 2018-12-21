import {http} from '../lib/http-plus';
//获取采购员
export const url_purchasing_getUser = "get|user/purchase/staffs";
export const getUser = function() {
    return http(Url2(url_purchasing_getUser));
};

export  const url_get_categories="get|/categories/purchaser";
export  const api_get_categories=function (data) {
    return http(url_get_categories,data)
};

export const url_check_categories="get|categories/:id";
export const api_check_categories=function (id,data) {
    return http(Url2(url_check_categories,{id}),data)
};

export const url_edit_categories = "put|categories/:id/purchaser-save";
export const api_edit_categories = function (id,data) {
    return http(Url2(url_edit_categories,{id}),data)
};

export const url_get_log = "get|categories/:id/logs";
export const api_get_log = function (id) {
    return http(Url2(url_get_log,{id}))
}