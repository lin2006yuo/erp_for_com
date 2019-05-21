/**
 * Created by wuchuguang on 16-12-26.
 */

import {http} from '../lib/http-plus';

export const url_get = "get|currency";
export const api_get = function (params) {
    return http(Url2(url_get) , params);
};

export const url_change = "put|currency/:id";
export const api_change = function (id, change) {
    return http(Url2(url_change, {id:id}), {system_rate:change});
};

export const url_add = "post|currency";
export const api_add = function (data) {
    return http(Url2(url_add), data);
};

export const url_update_official_rate = "post|currency/updateOfficialRate";
export const api_update_official_rate = function () {
    return http(Url2(url_update_official_rate));
};

export const url_history = "get|currency/:id";
export const api_history = function(id,data){
    return http(Url2(url_history, {id:id}),data);
};

export const url_select = "post|currency/selectOfficialRate";
export const api_select = function(code){
    return http(Url2(url_select), {code:code});
};

//排序
export const url_sort = "put|currency/sorts";
export const api_sort = function (data) {
    return http(Url2(url_sort),data);
}
