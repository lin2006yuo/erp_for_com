/**
 * Created by Administrator on 2018/5/30.
 */
import {http} from '../lib/http-plus';

//获取paytm账号列表
export const url_paytm_account = "get|paytm-account"
export const api_paytm_account = function(data){
    return http(url_paytm_account,data);
};

//Paytm账号新增
export const url_add_paytm_account = "post|paytm-account";
export const api_add_paytm_account = function(data){
    return http(url_add_paytm_account,data);
};

//Paytm账号启用停用
export const url_paytm_account_states = "post|paytm-account/states"
export const api_paytm_account_states = function(data){
    return http(url_paytm_account_states,data);
};

//Paytm账号查看
export const url_get_paytm_account = "get|paytm-account/:id"
export const api_get_paytm_account = function(id){
    return http(Url2(url_get_paytm_account,{id:id}));
};

//Paytm账号编辑
export const url_put_paytm_account = "put|paytm-account";
export const api_put_paytm_account = function(data){
    return http(url_put_paytm_account,data);
};

//Paytm获取订单授权信息
export const url_token_paytm_account = "get|paytm-account/token/:id"
export const api_token_paytm_account = function(id){
    return http(Url2(url_token_paytm_account,{id:id}));
};

//Paytm获取订单授权
export const url_token_paytm = "put|paytm-account/token";
export const api_token_paytm = function(data){
    return http(url_token_paytm,data);
};

//Paytm获取商品授权
export const url_tokencat_paytm = "put|paytm-account/tokencat";
export const api_tokencat_paytm = function(data){
    return http(url_tokencat_paytm,data);
};

//批量设置
export const url_post_batch_set = "post|paytm-account/batch-set"
export const api_paytm_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};