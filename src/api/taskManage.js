/**
 * Created by RondaFul on 2016/12/20.
 */
import {http} from '../lib/http-plus';
export const url_task_list = "get|task"
export const task_list = function(data){
    return http(url_task_list,data);
};
export const url_task_add = "post|task"
export const task_add = function(data){
    return http(url_task_add,data);
};
export const url_task_edit = "get|task/:id/edit"
export const task_edit = function(id){
    return http(Url2(url_task_edit,{id:id}));
};
export const url_task_update = "put|task/:id"
export const task_update = function(id,data){
    return http(Url2(url_task_update,{id:id}),data);
};
export const url_task_del = "delete|task/:id"
export const task_del = function(id){
    return http(Url2(url_task_del,{id:id}));
};
export const url_task_recover = "get|task/recover"
export const task_recover = function(data){
    return http(url_task_recover,data);
};
export const url_task_refresh = "get|task/refresh"
export const task_refresh = function(){
    return http(url_task_refresh);
};
