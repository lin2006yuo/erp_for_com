
import {http} from '../lib/http-plus';

export const url_get = "get|queue";
export const api_get = function(){
    return http(url_get,{
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
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

export const url_force_task = "get|queue/force-kill";
export const api_force_task = function(key, task){
    return http(url_force_task, {key,task});
};