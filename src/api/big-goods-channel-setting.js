import {http} from '../lib/http-plus';

//列表数据
export const url_get_big_goods_list = "get|shipping-method-large";
export const api_get_big_goods_list = function (data) {
    return http(url_get_big_goods_list, data);
};

//删除
export const url_delete_big_goods_channel = "delete|shipping-method-large/:id";
export const api_delete_big_goods_channel = function (id) {
    return http(Url2(url_delete_big_goods_channel, {id: id}));
};

//添加
export const url_post_add_big_goods_channel = "post|shipping-method-large";
export const api_post_add_big_goods_channel = function (data) {
    return http(Url2(url_post_add_big_goods_channel), data)
};