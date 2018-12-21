/**
 * Created by Administrator on 2018/5/18.
 */
import {http} from '../lib/http-plus';

//获取lazada站点
export const url_lazada_site = "get|lazada/site"
export const api_lazada_site = function(data){
    return http(url_lazada_site,data);
};

//获取lazada账号列表
export const url_lazada_account = "get|lazada-account"
export const api_lazada_account = function(data){
    return http(url_lazada_account,data);
};

//启用/停用lazada账号
export const url_lazada_account_states = "post|lazada-account/states"
export const api_lazada_account_states = function(data){
    return http(url_lazada_account_states,data);
};

//查看lazada账号信息
export const url_get_lazada_account = "get|lazada-account/:id"
export const api_get_lazada_account = function(id){
    return http(Url2(url_get_lazada_account,{id:id}));
};

//获取编辑lazada账号信息
export const url_lazada_account_edit = "get|lazada-account/:id/edit";
export const api_lazada_account_edit = function(id){
    return http(Url2(url_lazada_account_edit,{id:id}));
};

// 获取lazada授权页面信息
export const url_lazada_authorization = "post|lazada-account/authorization"
export const api_lazada_authorization = function(id){
    return http(url_lazada_authorization,{id:id});
};

// 获取lazada授权码
export const url_lazada_account_authorcode = "post|lazada-account/authorcode"
export const api_lazada_account_authorcode = function(data){
    return http(url_lazada_account_authorcode,data);
};

//更新lazada账号
export const url_put_lazada_account = "put|lazada-account/:id";
export const api_put_lazada_account = function(id,data){
    return http(Url2(url_put_lazada_account,{id:id}),data);
};

//添加lazada账号
export const url_add_lazada_account = "post|lazada-account";
export const api_add_lazada_account = function(data){
    return http(url_add_lazada_account,data);
};

//获取token
export const url_get_lazada_token = "post|lazada-account/token";
export const api_get_lazada_token = function(data){
    return http(url_get_lazada_token,data);
};

//更新token
export const url_get_token = "get|lazada-account/refresh_token/:id";
export const api_get_token = function(id){
    return http(Url2(url_get_token,{id:id}));
};

//批量设置
export const url_get_lazada_download = "post|lazada-account/update_download  ";
export const api_get_lazada_download = function(data){
    return http(url_get_lazada_download,data);
};
