/**
 * Created by RondaFul on 2016/11/11.
 */

import {http} from '../lib/http-plus';

export const url_pack_data = "get|packing";
export const api_pack_data = function (data) {
    return http(Url2(url_pack_data), data);
};
export const url_pack_getSupplier = "get|packing/getSupplier";
export const api_pack_getSupplier = function () {
    return http(Url2(url_pack_getSupplier));
};
export const url_pack_getCurrency = "get|packing/getCurrency";
export const api_pack_getCurrency = function () {
    return http(Url2(url_pack_getCurrency));
};

export const url_pack_add = "post|packing";
export const api_pack_add = function (data) {
    return http(Url2(url_pack_add), data);
};
export const url_pack_edit = "get|packing/:id/edit";
export const api_pack_edit = function (id) {
    return http(Url2(url_pack_edit,{id:id}));
};
export const url_pack_update = "put|packing/:id";
export const api_pack_update = function (id,data) {
    return http(Url2(url_pack_update,{id:id}),data);
};
export const url_pack_del = "delete|packing/:id";
export const pack_del = function(id) {
    return http(Url2(url_pack_del, {id:id}));
};