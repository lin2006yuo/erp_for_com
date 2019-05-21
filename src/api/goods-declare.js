import {http} from '../lib/http-plus';

//获取列表
export const url_goods_declare = 'get|goods-declare';
export const api_goods_declare = function (data) {
    return http(url_goods_declare,data)
};
//添加
export const url_add_goods_declare = 'post|goods-declare';
export const api_add_goods_declare = function (data) {
    return http(url_add_goods_declare,data)
};
//编辑
export const url_edit_goods_declare = 'get|goods-declare/:id';
export const api_edit_goods_declare = function (id) {
    return http(Url2(url_edit_goods_declare,{id:id}))
};
//更新
export const url_update_goods_declare = 'put|goods-declare/:id';
export const api_update_goods_declare = function (id,data) {
    return http(Url2(url_update_goods_declare,{id:id}),data)
};
//获取图片列表
export const url_get_image = 'get|goods-image/get-thumb';
export const api_get_image = function (data) {
    return http(Url2(url_get_image),data)
};
//删除
export const url_delete_goods_declare = 'delete|goods-declare/:id';
export const api_delete_goods_declare = function (id,data) {
    return http(Url2(url_delete_goods_declare,{id:id}),data)
};
