
import {http} from '../lib/http-plus';

export const url_read = "post|release/:id/read";
export const api_read = function(id){
    return http(Url2(url_read,{id}));
};

export const url_reads = "get|release/reads";
export const api_reads = function(){
    return http(url_reads);
};

export const url_list = "get|release";
export const api_list = function(params = {}){
    return http(url_list, params);
};

export const url_get = "get|release/:id";
export const api_get = function(id){
    return http(Url2(url_get,{id}));
};

export const url_update = "put|release/:id";
export const api_update = function(id, params){
    return http(Url2(url_update,{id}),params);
};

export const url_create = "post|release";
export const api_create = function(post){
    return http(url_create, post);
};

export const url_remove ="delete|release/:id";
export const api_remove = function(id){
    return http(Url2(url_remove, {id}));
};

