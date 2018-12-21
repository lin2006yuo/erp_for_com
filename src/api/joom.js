/**
 * Created by RondaFul on 2016/11/14.
 */
import {http} from '../lib/http-plus';

//3.1获取joom账号列表
export const url_joom_list = "get|joom-account";
export const api_joom_list = function(data){
    return http(url_joom_list,data);
};

// 3.2 查看joom账号信息
export const url_joom_list_look = "get|joom-account/:id";
export const api_joom_list_look = function(id){
    return http(Url2(url_joom_list_look,{id:id}));
};

// 3.3 启用/停用joom账号
export const url_joom_list_status = "post|joom-account/status";
export const api_joom_list_status = function(data){
    return http(url_joom_list_status,data);
};

//3.4  添加joom账号
export const url_joom_list_add = "post|joom-account";
export const api_joom_list_add = function(data){
    return http(url_joom_list_add,data);
};

//3.5 更新joom账号
export const url_joom_list_update = "put|joom-account/:id";
export const api_joom_list_update = function(id,data){
    return http(Url2(url_joom_list_update,{id:id}),data);
};

//3.6 编辑joom账号
export const url_joom_list_edit = "get|joom-account/:id/edit";
export const api_joom_list_edit = function(id){
    return http(Url2(url_joom_list_edit,{id:id}));
};

//4.1获取joom账号列表
export const url_joom_shop_list = "get|joom-shop";
export const api_joom_shop_list = function(data){
    return http(url_joom_shop_list,data);
};

//4.2 拉取帐号信息
export const url_joom_shop_accounts = "get|joom-shop/accounts";
export const api_joom_shop_accounts = function(data){
    return http(url_joom_shop_accounts,data);
};

//4.3 添加joom店铺
export const url_joom_shop_add = "post|joom-shop";
export const api_joom_shop_add = function(data){
    return http(url_joom_shop_add,data);
};

//4.4 查看joom账号信息
export const url_joom_shop_look = "get|joom-shop/:id";
export const api_joom_shop_look = function(id,data){
    return http(Url2(url_joom_shop_look,{id:id}),data);
};

//4.5 编辑joom账号信息
export const url_joom_shop_edit = "get|joom-shop/:id/edit";
export const api_joom_shop_edit = function(id,data){
    return http(Url2(url_joom_shop_edit,{id:id}),data);
};

//4.6 启用/停用joom账号
export const url_joom_shop_status = "post|joom-shop/status";
export const api_joom_shop_status = function(data){
    return http(url_joom_shop_status,data);
};

//4.7 更新joom账号
export const url_joom_shop_update = "put|joom-shop/:id";
export const api_joom_shop_update = function(id,data){
    return http(Url2(url_joom_shop_update,{id:id}),data);
};

//4.8 进入joom授权页面
export const url_joom_shop_authorization = "post|joom-shop/authorization";
export const api_joom_shop_authorization = function(data){
    return http(url_joom_shop_authorization,data);
};

//4.9 获取授权码
export const url_joom_shop_author_code = "post|joom-shop/authorCode";
export const api_joom_shop_author_code = function(data){
    return http(url_joom_shop_author_code,data);
};

//4.10 获取joom账号token
export const url_joom_shop_token = "post|joom-shop/token";
export const api_joom_shop_token = function(data){
    return http(url_joom_shop_token,data);
};

//4.11 批量设置
export const url_joom_shop_set = "post|/joom-shop/set";
export const api_joom_shop_set = function(data){
    return http(url_joom_shop_set,data);
};

export const url_post_batch_set = "post|joom-account/batch-set";
export const api_joom_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};
