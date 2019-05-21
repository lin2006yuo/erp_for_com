/**
 * Created by RondaFul on 2016/11/11.
 */
import {http} from '../lib/http-plus';
export const url_tag_data = "get|tag"
export const api_tag_data = function(data){
    return http(url_tag_data, data);
};
export const url_add = "post|tag"
export const api_add = function(data){
    return http(url_add, data);
};
export const url_delete = "delete|tag/:id"
export const api_delete = function(id){
    return http(Url2(url_delete,{id:id}));
};
export const url_edit = "get|tag/:id/edit"
export const api_edit = function(id){
    return http(Url2(url_edit,{id:id}));
};
export const url_update = "put|tag/:id"
export const api_update = function(id,data){
    return http(Url2(url_update,{id:id}),data);
};
