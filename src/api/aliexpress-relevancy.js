/**
 * Created by rondaful on 2017/6/6.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

//获取
export const url_aliexpre_list = "get|aliexpreee-category-map-list";
export const api_aliexpre_list = function (data) {
  return http(url_aliexpre_list,data);
}

//增加
export const url_add_aliexpre_list = "post|add-publish-ali-category";
export const api_add_aliexpre_list = function (data) {
  return http(url_add_aliexpre_list, data);
}

//删除
export const url_del_aliexpre_list = "post|aliexpress-auth-category-delete";
export const api_del_aliexpre_list = function (data) {
  return http(url_del_aliexpre_list, data);
};


//编辑权限
export const url_edit_aliexpre_list ="get|aliexpress-auth-category-edit";
export const api_edit_aliexpre_list = function (data) {
  return http(url_edit_aliexpre_list, data);
};

//编辑
export const url_aliexpress_edit = "post|edit-publish-ali-category";
export const api_edit_publish = function (data) {
    return http(url_aliexpress_edit, data)
}
