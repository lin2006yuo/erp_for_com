/**
 * Created by wuchuguang on 16-11-29.
 */

import {http} from '../lib/http-plus';

export const url_get = "get|system/menu"
export const api_get = function(){
  return http(url_get);
};

export const url_pages = "get|system/pages"
export const api_pages = function(){
  return http(url_pages);
};

export const url_add = "post|system/menu/add"
export const api_add = function(data){
  return http(url_add, data);
};

export const url_delete = "delete|system/menu"
export const api_delete = function(id){
  return http(url_delete,{id:id});
};

export const url_change = "put|system/menu/change"
export const api_change = function(changes){
  return http(url_change, changes);
};

export const url_setting = "put|system/menu/:id"
export const api_setting = function(id, setting){
  return http(Url2(url_setting,{id:id}), setting);
};

export const url_change_status = "put|system/menu/change-status"
export const api_change_status = function(datas){
  return http(url_change_status, datas);
};
