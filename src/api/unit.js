/**
 * Created by RondaFul on 2016/11/11.
 */
import {http} from '../lib/http-plus';

export const url_unit_data = "get|unit"
export const api_unit_data = function(data){
    return http(url_unit_data,data);
};
export const url_add = "post|unit"
export const api_add = function(data){
    return http(url_add,data);
};
export const url_delete = "delete|unit/:id"
export const api_delete = function(id){
    return http(Url2(url_delete,{id:id}));
};
export const url_edit = "get|unit/:id/edit"
export const api_edit = function(id){
    return http(Url2(url_edit,{id:id}));
};
export const url_update = "put|unit/:id"
export const api_update = function(id,data){
    return http(Url2(url_update,{id:id}),data);
};
