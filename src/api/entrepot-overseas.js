/**
 * Created by wuchuguang on 16-11-24.
 */

import {http} from '../lib/http-plus';

export const url_get = "get|warehouse-goods";
export const api_get = function(data){
  return http(url_get,data)
};

//获取导出字段
export const url_get_export_title = "get|warehouse-goods/export-fields";
export const api_get_export_title = function(data){
    return http(url_get_export_title,data)
};

//导出
export const url_export = "post|warehouse-goods/export";
export const api_export = function(data){
  return http(url_export,data)
};

export const url_mdf_alert = "post|warehouse-goods/alert";
export const api_mdf_alert = function(ids, value){
  return http(url_mdf_alert, {ids, value})
};

export const url_get_details = "get|warehouse-goods/:id";
export const api_get_details = function(id, params){
  return http(Url2(url_get_details,{id}), params)
};

export const url_get_warehouses = "get|warehouse-goods/getWarehouse";
export const api_get_warehouses = function(type){
  return http(url_get_warehouses,{type:type})
};

export const url_oos_details = "get|warehouse-goods/:id/oos-details";
export const api_oos_details = function(id){
    return http(Url2(url_oos_details,{id}));
};
