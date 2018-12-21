/**
 * Created by Administrator on 2018/6/15.
 */

import {http} from '../lib/http-plus';

//获取 walmart 账号列表
export const url_walmart_account = "get|walmart-account";
export const api_walmart_account = function (data) {
    return http(url_walmart_account, data);
};

//walmart账号新增
export const url_add_walmart_account = "post|walmart-account";
export const api_add_walmart_account = function(data){
    return http(url_add_walmart_account,data);
};

//walmart账号启用停用
export const url_walmart_account_states = "post|walmart-account/states"
export const api_walmart_account_states = function(data){
    return http(url_walmart_account_states,data);
};

//walmart账号查看
export const url_get_walmart_account = "get|walmart-account/:id"
export const api_get_walmart_account = function(id){
    return http(Url2(url_get_walmart_account,{id:id}));
};

//walmart账号编辑
export const url_put_walmart_account = "put|walmart-account";
export const api_put_walmart_account = function(data){
    return http(url_put_walmart_account,data);
};

//walmart获取订单授权信息
export const url_token_walmart_account = "get|walmart-account/token/:id"
export const api_token_walmart_account = function(id){
    return http(Url2(url_token_walmart_account,{id:id}));
};

//walmart获取订单授权
export const url_token_walmart = "put|walmart-account/token";
export const api_token_walmart = function(data){
    return http(url_token_walmart,data);
};

//walmart获取站点
export const url_walmart_site = "get|walmart/site";
export const api_walmart_site = function(data){
    return http(url_walmart_site,data);
};

//批量设置
export const url_post_batch_set = "post|walmart-account/batch-set";
export const api_walmart_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};

