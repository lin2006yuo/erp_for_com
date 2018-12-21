/**
 * Created by wuchuguang on 17-3-1.
 */


import {http} from '../lib/http-plus';

export const url_get = "get|purchase-rules";
export const api_get = function () {
    return http(Url2(url_get));
};

export const url_sort = "post|purchase-rules/sort";
export const api_sort = function (sorts) {
    return http(Url2(url_sort), sorts);
};

export const url_change_status = "post|purchase-rules/:id/status/:status";
export const api_change_status = function (id, status) {
    return http(Url2(url_change_status, {id, status}));
};

export const url_del = "delete|purchase-rules/:id";
export const api_del = function (id) {
    return http(Url2(url_del, {id:id}));
};

export const url_add = "post|purchase-rules";
export const api_add = function (params) {
    return http(Url2(url_add), params);
};

export const url_update = "put|purchase-rules/:id";
export const api_update = function (id, params) {
    return http(Url2(url_update, {id}), params);
};

export const url_lookup = "get|purchase-rules/:id/edit";
export const api_lookup = function (id) {
    return http(Url2(url_lookup, {id}));
};

export const url_rule_items = "get|purchase-rules-items";
export const api_rule_items = function () {
    return http(Url2(url_rule_items));
};

export const url_get_resource = "post|purchase-rules/resources";
export const api_get_resource = function (params) {
    return http(Url2(url_get_resource), params);
};

export const url_approver = "get|user";
export const api_approver = function (query) {
    return http(Url2(url_approver), {snType:'realname', snText:query});
}