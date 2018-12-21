/**
 * Created by RondaFul on 2018/8/4.
 */
import {http} from '../lib/http-plus';

// 获取揽收商列表
export const url_get_collector = "get|collector";
export const api_get_collector = function (data) {
    return http(url_get_collector, data);
};

//获取揽收商信息
export const url_get_collector_info = "get|collector/:id";
export const api_get_collector_info = function (id) {
    return http(Url2(url_get_collector_info, {id: id}));
};

//新增揽收商
export const url_add_collector = "post|collector";
export const api_add_collector = function (data) {
    return http(url_add_collector, data);
};

//修改揽收商信息
export const url_update_collector = "put|collector/:id";
export const api_updata_collector = function (id, data) {
    return http(Url2(url_update_collector, {id: id}), data);
};

//获取揽收商对应邮寄方式列表
export const url_get_shipping_by_collector = "get|collector/:id/shipping-lists";
export const api_get_shipping_by_collector = function (id) {
    return http(Url2(url_get_shipping_by_collector, {id: id}));
};


//获取揽收商下拉框列表
export const url_collector_list = "get|collector/list";
export const api_collector_list = function (data) {
    return http(url_collector_list, data);
};