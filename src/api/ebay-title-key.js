import {http} from '../lib/http-plus';
//获取标题库列表
export const url_ebay_titles="get|publish/ebay/titles";
export const api_ebay_titles = function (data) {
    return http(url_ebay_titles,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:60000
    })
};
//编辑指定商品标题库
export const url_edit_ebay_titles = "get|publish/ebay/titles/:goods_id";
export const api_edit_ebay_titles = function (id) {
    return http(Url2(url_edit_ebay_titles,{goods_id:id}))
};
//保存标题库
export const url_save_ebay_titles = "put|publish/ebay/titles/:goods_id";
export const api_save_ebay_titles = function (goods_id,data) {
    return http(Url2(url_save_ebay_titles,{goods_id:goods_id}),data)
};
//Joom店铺分类树
export const url_joom_category_tree = 'get|joom-category/category';
export const api_joom_category_tree = function (data) {
    return http(url_joom_category_tree, data);
};
//批量编辑标题库
export const url_batch_edit_title = 'get|publish/ebay/titles/batch';
export const api_batch_edit_title = function (data) {
    return http(url_batch_edit_title, data);
};
//批量保存标题库
export const url_batch_save_title = 'put|publish/ebay/titles/batch';
export const api_batch_save_title = function (data) {
    return http(url_batch_save_title, data);
};