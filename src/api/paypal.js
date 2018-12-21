/**
 * Created by wuchuguang on 16-11-16.
 */

import {http} from '../lib/http-plus';

export const url_add = "post|paypal-account";
export const api_add = function (form) {
    return http(Url2(url_add), form);
};

export const url_get = "get|paypal-account";
export const api_get = function (data) {
    return http(Url2(url_get),data);
};

export const url_info = "get|paypal-account/:id";
export const api_info = function(id){
    return http(Url2(url_info, {id:id}));
};

export const url_edit = "get|paypal-account/:id/edit";
export const api_edit = function (id) {
    return http(Url2(url_edit, {id:id}));
};

export const url_change_status = "post|paypal-account/status";
export const api_change_status = function (id, newStatus) {
    return http(url_change_status, {id:id, is_invalid:newStatus});
};

export const url_upd = "put|paypal-account/:id";
export const api_upd = function (id, form) {
    return http(Url2(url_upd,{id:id}), form);
};

export const test = function () {
    return http('GET',"http://rap.taobao.org/mockjs/10224/fasfasasf");
};

export const url_post_batch_set = "post|paypal-account/batch-set";
export const api_paypal_batch_set = function(data){
    return http(url_post_batch_set,data);
};