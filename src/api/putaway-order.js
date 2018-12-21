/**
 * Created by Administrator on 2017/11/23.
 */
import {http} from '../lib/http-plus';
export const url_get_putaway = "get|putaway-order";
export const api_get_putaway = function (params) {
    return http(Url2(url_get_putaway), params);
};

export const url_look_putaway = "get|putaway-order/:id";
export const api_look_putaway = function (id) {
    return http(Url2(url_look_putaway,{id:id}));
};

//获取上架区类型
export const url_get_type = "get|putaway-order/types";
export const api_get_type = function (id) {
    return http(Url2(url_get_type,{id:id}));
};
