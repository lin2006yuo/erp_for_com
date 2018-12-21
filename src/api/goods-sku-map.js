/**
 * Created by RondaFul on 2016/11/11.
 */
import {http} from '../lib/http-plus';

//获取列表
export const url_gsMap_data = "get|sku-map";
export const api_gsMap_data = function(data){
  return http(url_gsMap_data,data)
};
//添加
export const url_add = "post|sku-map";
export const api_add = function(data){
  return http(url_add,data)
};
    //查看
export const url_look = "get|sku-map/:id";
export const api_look = function(id){
  return http(Url2(url_look,{id:id}))
};
    //编辑
export const url_edit = "get|sku-map/:id/edit"
export const api_edit = function(id){
  return http(Url2(url_edit,{id:id}))
};
//更新
export const url_update = "put|sku-map/:id";
export const api_update = function(id,data){
  return http(Url2(url_update,{id:id}),data)
};

//获取平台
export const url_get_channel = "get|sku-map/channel"
export const api_get_channel = function(data){
  return http(url_get_channel,data)
};
//获取分类列表
export const url_get_categories = "get|categories"
export const api_get_categories = function(){
  return http(url_get_categories)
};
//删除
export const url_del_sigle = "delete|sku-map/:id"
export const api_del_sigle = function(id){
  return http(Url2(url_del_sigle,{id:id}))
};
//删除选中
export const url_del_select = "post|sku-map/batch"
export const api_del_select = function(data){
  return http(url_del_select,data)
};
//生成sku
export const url_del_code = "post|create-sku-code";
export const api_del_code = function(data){
  return http(url_del_code,data)
};
//查看是否已关联
export const url_sku_map = "get|sku-map/map";
export const api_sku_map = function(data){
  return http(url_sku_map,data)
};
//导入
export const url_import_sku_map = "post|sku-map/import";
export const api_import_sku_map = function(data){
  return http(url_import_sku_map,data,{
      contentType:'application/x-www-form-urlencoded',
      timeout:INFINITE
  })
};
//导出
export const url_sku_export = "post|sku-map/export";
export const api_sku_export = function (data) {
    return http(url_sku_export,data);
};

