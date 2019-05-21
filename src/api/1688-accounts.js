import {http} from '../lib/http-plus';
//查看列表
export const url_get_accountlist = "get|ali1688-account";
export const api_get_accountlist = function(data) {
    return http(url_get_accountlist, data);
};
//添加
export const url_add_accountlist = "post|ali1688-account";
export const api_add_accountlist = function(data) {
    return http(url_add_accountlist, data);
};
//查看
export const url_look_accountlist = "get|ali1688-account/:id";
export const api_look_accountlist = function(id) {
    return http(Url2(url_look_accountlist,{id:id}));
};
//更新
export const url_update_accountlist = "put|ali1688-account/:id";
export const api_update_accountlist = function(id,data) {
    return http(Url2(url_update_accountlist,{id:id}),data);
};
//启用停用 ali1688-account/states
export const url_set_states = "post|ali1688-account/states";
export const api_set_states = function(data) {
    return http(url_set_states,data);
};
//1688获取授权码 ali1688-account/getAuthorCode
export const url_get_author_code = "post|ali1688-account/getAuthorCode";
export const api_get_author_code = function(data) {
    return http(url_get_author_code,data);
};
//获取token   ali1688-account/getToken
export const url_get_token = "post|ali1688-account/getToken";
export const api_get_token = function(data) {
    return http(url_get_token,data);
};

//批量设置
export const url_post_batch_set = "post|ali1688-account/batch-set"
export const api_1688_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};