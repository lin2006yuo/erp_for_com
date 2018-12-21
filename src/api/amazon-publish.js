import {http} from '../lib/http-plus';
//图片
export const url_git_img = "get|goods-image/:id";
export const api_git_img= function(id, data) {
    return http(Url2(url_git_img, {id:id}), data);
};
//图片
export const url_get_thumb = "get|goods-image/get-thumb";
export const api_get_thumb = function(data) {
    return http(url_get_thumb, data);
};
//获取图片  /goods-image/self-image
export const url_get_self_image = "get|goods-image/self-image";
export const api_get_self_image = function(data) {
    return http(url_get_self_image, data);
};
//查看
export const url_amazon_product_export= 'get|publish/amazon-product-export/:goods_id';
export const api_amazon_product_export= function(goods_id) {
    return http(Url2(url_amazon_product_export, {goods_id:goods_id}));
};
//列表
export const url_amazon_product_list = 'get|publish/amazon-product-export'
export const api_amazon_product_list= function(data) {
    return http(Url2(url_amazon_product_list), data);
};
//删除
export const url_amazon_del_product = 'delete|publish/amazon-product-export/:goods_id'
export const api_amazon_del_product= function(goods_id) {
    return http(Url2(url_amazon_del_product, {goods_id:goods_id}));
};
//编辑
export const url_amazon_edit_product = 'put|publish/amazon-product-export/:goods_id'
export const api_amazon_edit_product= function(goods_id,data) {
    return http(Url2(url_amazon_edit_product, {goods_id}), data);
};
//添加
export const url_amazon_add_product = 'post|publish/amazon-product-export';
export const api_amazon_add_product= function(data) {
    return http(url_amazon_add_product, data);
};
//获取
export const url_amazon_get_product= 'get|publish/amazon-product-export/goods/:goods_id';
export const api_amazon_get_product= function(goods_id) {
    return http(Url2(url_amazon_get_product, {goods_id:goods_id}));
};

export const url_amazon_account = "get|amazon-account";
export const api_amazon_account = function(){
    return http(url_amazon_account);
};

export const url_amazon_account_sales = "get|member-ship/2/sales/publish";
export const api_amazon_account_sales = function(){
    return http(url_amazon_account_sales);
};

export const url_down_excel = "get|publish/amazon-product-export/download";
export const api_down_excel = function(data){
    return http(url_down_excel, data);
};

export const url_get_user = "get|department/getUser";
export const api_get_user = function () {
    return http(url_get_user)
};
