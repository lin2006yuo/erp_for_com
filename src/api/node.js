/**
 * Created by user on 2017/1/21.
 */
import {http} from '../lib/http-plus';

/*节点列表*/
export const url_node_list = "get|node"
export const api_node_list = function(){
  return http(url_node_list);
};

/*添加*/
export const url_add_node = "post|node"
export const api_add_node = function(data){
  return http(url_add_node,data);
};

/*编辑*/
export const url_edit_node = "get|node/:id/edit"
export const api_edit_node = function(id){
  return http(Url2(url_edit_node,{id:id}));
};

/*查看*/
export const url_look_node = "get|node/:id"
export const api_look_node = function(id){
  return http(Url2(url_look_node,{id:id}));
};

/*更新*/
export const url_update_node = "put|node/:id"
export const api_update_node = function(id, data){
  return http(Url2(url_update_node,{id:id}), data);
};

/*删除*/
export const url_delete_node = "delete|node/:id"
export const api_update_node = function(id){
  return http(Url2(url_delete_node,{id:id}));
};

/*改变状态*/
export const url_change_status = "get|node/changeStatus"
export const api_change_status = function(data){
  return http(url_change_status,data);
};

/*获取节点类型*/
export const url_node_type = "get|node/getType"
export const api_get_type = function(level){
  return http(url_node_type,level);
};

/*排序*/
export const url_node_sort = "post|node/sort"
export const api_node_sort = function(data){
  return http(url_node_sort,data);
};
