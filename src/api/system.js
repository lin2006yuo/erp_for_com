/**
 * Created by RondaFul on 2016/12/30.
 */
import {http} from '../lib/http-plus';

export const url_system_list = "get|config/:id"
export const system_list = function(id){
    return http(Url2(url_system_list,{id:id}));
};
export const url_system_update = "put|config/paramsConfig/:id"
export const system_update = function(id,data){
    return http(Url2(url_system_update,{id:id}),data);
};
export const url_system_getGroups = "get|config/groups"
export const system_getGroups = function(){
    return http(url_system_getGroups);
};
export const url_args_list = "get|config"
export const args_list = function(data){
    return http(url_args_list,data);
};
export const url_args_changeStatus = "get|config/status"
export const args_changeStatus = function(data){
    return http(url_args_changeStatus,data);
};
export const url_args_del = "delete|config/:id"
export const args_del = function(id){
    return http(Url2(url_args_del,{id:id}));
};
export const url_args_add = "post|config"
export const args_add = function(data){
    return http(url_args_add,data);
};
export const url_args_edit = "get|config/:id/edit"
export const args_edit = function(id){
    return http(Url2(url_args_edit,{id:id}));
};
export const url_args_update = "put|config/:id"
export const args_update = function(id,data){
    return http(Url2(url_args_update,{id:id}),data);
};
export const url_args_sort = "post|config/sort"
export const args_sort = function(data){
    return http(url_args_sort,data);
};

export const url_system_time = "get|system/time"
export const api_system_time = function(){
    return http(url_system_time);
};
export const url_args_type = "get|config/type"
export const args_type = function(){
    return http(url_args_type);
};
