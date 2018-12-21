/**
 * Created by RondaFul on 2016/11/14.
 */
import {http} from '../lib/http-plus';

export const url_wish_list = "get|wish-account"
export const wish_list = function(data){
    return http(url_wish_list,data);
};
export const url_wish_look = "post|wish-account/authorization"
export const wish_look = function(data){
    return http(url_wish_look,data);
};
export const url_wish_client = "post|wish-account/authorCode"
export const wish_client = function(data){
    return http(url_wish_client,data);
};
export const url_wish_token = "post|wish-account/token"
export const wish_token = function(data){
    return http(url_wish_token,data);
};
export const url_wish_invalid = "post|wish-account/states"
export const wish_invalid = function(data){
    return http(url_wish_invalid,data);
};
export const url_wish_add = "post|wish-account"
export const wish_add = function(data){
    return http(url_wish_add,data);
};
export const url_wish_check = "get|wish-account/:id"
export const wish_check = function(id){
    return http(Url2(url_wish_check,{id:id}));
};
export const url_wish_edit = "get|wish-account/:id/edit"
export const wish_edit = function(id){
    return http(Url2(url_wish_edit,{id:id}));
};
export const url_wish_update = "put|wish-account/:id";
export const wish_update = function(id,data){
    return http(Url2(url_wish_update,{id:id}),data);
};
//更新token  无文档
export const url_refresh_token = "get|wish-account/refresh_token/:id";
export const api_refresh_token = function(id){
    return http(Url2(url_refresh_token,{id:id}));
};
//批量设置
export const url_post_batch_set = "post|wish-account/batch-set"
export const api_wish_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};
