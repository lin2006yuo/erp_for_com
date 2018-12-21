/**
 * Created by RondaFul on 2017/5/9.
 */
import {http} from '../lib/http-plus';
//------------------------------------                                    -joom刊登
// get info

export const get_info_data = 'get|publish/joom/getData';
export const api_info_data = function (data) {
    return http(get_info_data, data);
}

export const get_joom_account = 'get|publish/joom/getSellers';
export const api_joom_account = function (data) {
    return http(get_joom_account, data)
}

export const url_joom_publish = 'post|publish/joom/add';
export const api_joom_publish = function (data) {
    return http(url_joom_publish, data);
}

export const url_joom_store = 'get|joom-category/checkshops';
export const api_joom_store = function (data) {
    return http(url_joom_store, data)
}
////get|publish/joom/edit/id/:id/status/:status
export const url_joom_edit = 'get|publish/joom/edit/id/:id/status/:status';
export const api_joom_edit = function (id, status) {
    return http(Url2(url_joom_edit,{id,status}));
}

export const url_joom_update = 'post|publish/joom/update';
export const api_joom_update = function (data) {
    return http(url_joom_update, data);
}

export const url_joom_account_and_store = 'get|joom-category/checkshops';
export const api_joom_account_and_store = function (data) {
    return http(url_joom_account_and_store, data);
}

export const url_joom_color = 'get|joomattr/color';
export const api_joom_color = function (data) {
    return http(url_joom_color, data)
}

