/**
 * Created by Administrator on 2018/8/31.
 */

import {http} from '../lib/http-plus';

//获取 vova 账号列表
export const url_vova_account = "get|vova-account";
export const api_vova_account = function (data) {
    return http(url_vova_account, data);
};

//vova账号新增
export const url_add_vova_account = "post|vova-account";
export const api_add_vova_account = function(data){
    return http(url_add_vova_account,data);
};

//vova账号启用停用
export const url_vova_account_states = "post|vova-account/states"
export const api_vova_account_states = function(data){
    return http(url_vova_account_states,data);
};

//vova账号查看
export const url_get_vova_account = "get|vova-account/:id"
export const api_get_vova_account = function(id){
    return http(Url2(url_get_vova_account,{id:id}));
};

//vova账号编辑
export const url_put_vova_account = "put|vova-account";
export const api_put_vova_account = function(data){
    return http(url_put_vova_account,data);
};

//vova获取订单授权信息
export const url_token_vova_account = "get|vova-account/token/:id"
export const api_token_vova_account = function(id){
    return http(Url2(url_token_vova_account,{id:id}));
};

//vova获取订单授权
export const url_token_vova = "put|vova-account/token";
export const api_token_vova = function(data){
    return http(url_token_vova,data);
};

//批量设置
export const url_post_batch_set = "post|vova-account/batch-set";
export const api_vova_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};
