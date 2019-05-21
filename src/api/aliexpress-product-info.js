/**
 * Created by rondaful on 2017/6/6.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

//获取
export const url_category_list = "get|aliexpress-product-template-list";
export const api_category_list = function (data) {
  return http(url_category_list,data);
};

//增加1
export const url_create_category = "post|create-relation-product-template";
export const api_create_category = function (data) {
  return http(url_create_category, data);
};

//增加2
export const url_create_custom= "post|create-custom-product-template";
export const api_create_custom = function (data) {
  return http(url_create_custom, data);
};

//预览
export const url_review= "post|review";
export const api_review = function (data) {
  return http(url_review, data);
};
//查看数据
export const url_look_template= "get|aliexpreee-product-template-content";
export const api_look_template = function (data) {
    return http(url_look_template, data);
};

//编辑
export const url_edit= "post|edit-product-template";
export const api_edit = function (data) {
  return http(url_edit, data);
};

export const url_edit_img= "get|get-relation-template-images";
export const api_edit_img = function (data) {
  return http(url_edit_img, data);
};
//删除
export const url_del= "post|delete-product-template";
export const api_del = function (data) {
  return http(url_del, data);
};
//分类
export const url_groups= "get|publish/express/groups";
export const api_groups = function (data) {
  return http(url_groups, data);
};

//已刊登列表
export const url_product_list= "get|publish/express/productList";
export const api_product_list = function (data) {
  return http(url_product_list, data);
};

//上传网络图片
export const url_upload_net_images = "post|upload-net-images";
export const api_upload_net_images = function (data) {
  return http(url_upload_net_images, data);
};

//上传本地图片
export const url_upload_local_images = "post|upload-local-images";
export const api_upload_local_images = function (data) {
  return http(url_upload_local_images, data);
};
//上传本地图片返回https开头的图片 仅ebay模块适用
export const url_upload_style_imgs = "post|Publish/ebay-common/upload-style-imgs";
export const api_upload_style_imgs = function (data) {
    return http(url_upload_style_imgs, data);
};


