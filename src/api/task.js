/**
 * Created by wuchuguang on 17-3-3.
 */

import {http} from '../lib/http-plus';
export const url_get = "get|task";
export const api_get = function(){
    return http(url_get,{
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};
export const url_reload = "get|task/reloadclass"
export const api_reload = function(){
    return http(url_reload);
};
export const url_synchronous  = "post|task/synchronous";
export const api_synchronous = function(params){
    return http(url_synchronous, params);
};

export const url_rules = "get|task/:workerId/rules"
export const api_rules = function(id){
    return http(Url2(url_rules,{workerId:id}));
};
export const url_status = "put|task/:taskId/status"
export const api_status = function(id,{status}){
    return http(Url2(url_status,{taskId:id}),{status});
};
export const url_worker_get = "get|task/worker/:workerId"
export const api_worker_get = function(id){
    return http(Url2(url_worker_get,{workerId:id}));
};
export const url_worker_new = "post|task/worker"
export const api_worker_new = function(taskid, params){
    return http(url_worker_new,Object.assign({task_id:taskid},params));
};
export const url_worker_mdf = "put|task/worker/:workerId"
export const api_worker_mdf = function(id,data){
    return http(Url2(url_worker_mdf,{workerId:id}),data);
};
export const url_worker_status = "put|task/worker/status/:workerId"
export const api_worker_status = function(id,data){
    return http(Url2(url_worker_status,{workerId:id}),{data});
};
export const url_worker_remove = "delete|task/worker"
export const api_worker_remove = function(id){
    return http(url_worker_remove,{id:id});
};
export const url_worker_logs = "get|task/worker/:workerId/logs"
export const api_worker_logs = function(id,count){
    return http(Url2(url_worker_logs,{workerId:id}),{count});
};
export const url_worker_schedulers = "get|task/worker_schedulers"
export const api_worker_schedulers = function(){
    return http(url_worker_schedulers);
};
export const url_worker_change_time = "put|task/worker/:workerId/changetime"
export const api_worker_change_time = function(workerId,time){
    return http(Url2(url_worker_change_time,{workerId:workerId}),{time:time});
};
export const url_add_global_task = "put|task/global_task"
export const api_add_global_task = function(data){
    return http(url_add_global_task,data);
};
export const url_global_tasks = "get|task/global_tasks"
export const api_global_tasks = function(){
    return http(url_global_tasks);
};
export const url_global_task_change = "put|task/global_task_change"
export const api_global_task_change = function(data){
    return http(url_global_task_change,data);
};




