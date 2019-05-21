
import {http} from '../lib/http-plus';

//获取标签
export const api_get_queue_label = ()=>{
    return http("get|queue/labelname");
};

export const url_get = "get|queue";
export const api_get = data=>{
    return http(url_get,{contentType:'application/x-www-form-urlencoded',timeout:INFINITE,label_name:data});
};

export const url_reload = "post|queue/reload";
export const api_reload = function(queuer){
    return http(url_reload, {queuer});
};

export const url_status = "get|queue/status";
export const api_status = function(params){
    return http(url_status, params,{
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE});
};

export const url_change_status = "post|queue/status";
export const api_change_status = function(params){
    return http(url_change_status, params);
};

export const url_elements = "get|queue/elements";
export const api_elements = function(key){
    return http(url_elements, {key});
};
export const url_logs = "get|queue/logs";
export const api_logs = function(key){
    return http(url_logs, {key});
};

export const url_clear = "post|queue/clear";
export const api_clear = function(key){
    return http(url_clear, {key});
};

export const url_clear_fail_tag = "post|queue/clear_fail_tag";
export const api_clear_fail_tag = function(key, element = null){
    return http(url_clear_fail_tag, {key,element});
};
export const url_clear_current_fail = "post|queue/clear-fail";
export const api_clear_current_fail =(key)=>{
    return http(url_clear_current_fail, {key:key});
};


export const url_force_task = "get|queue/force-kill";
export const api_force_task = function(key, task,hosttype){
    return http(url_force_task, {key,task,hosttype});
};

//获取队列类型
export const url_get_queue_type = "get|queue/runtypes";
export const api_get_queue_type = ()=>{
    return http(url_get_queue_type);
};

//更改类型
export const url_change_queue_type = "put|queue/change-runtype";
export const api_change_queue_type = data=>{
    return http(url_change_queue_type,data);
};

//删除当前队列的某元素
export const url_del_remove_element = "delete|queue/remove-element";
export const api_del_remove_element = data=>{
    return http(url_del_remove_element,data);
};

//详情列表消费点击
export const url_get_queue_consuming = "get|queue/consuming";
export const api_get_queue_consuming = data=>{
    return http(url_get_queue_consuming,data);
};

//卸载队列
export const url_uninstall_task='get|queue/uninstall';
export const api_uninstall_task=data=>{
    return http(url_uninstall_task,{queue_class:data});
};

//安装队列
export const url_install_task='get|queue/install';
export const api_install_task=data=>{
    return http(url_install_task,{queue_class:data});
};

//获取队列列表
export const url_queue_list='get|queue/classes';
export const api_queue_list=()=>{
    return http(url_queue_list);
};

//队列编辑
export const url_queue_edit='put|queue/edit';
export const api_queue_edit=data=>{
    return http(url_queue_edit,data);
};
