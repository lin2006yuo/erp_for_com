/**
 * Created by Administrator on 2018/8/30.
 */

import {http} from '../lib/http-plus';

//获取 zoodmall 账号列表
export const url_zoodmall_account = "get|zoodmall-account";
export const api_zoodmall_account = function (data) {
    return http(url_zoodmall_account, data);
};

//zoodmall账号新增
export const url_add_zoodmall_account = "post|zoodmall-account";
export const api_add_zoodmall_account = function(data){
    return http(url_add_zoodmall_account,data);
};

//zoodmall账号启用停用
export const url_zoodmall_account_states = "post|zoodmall-account/states"
export const api_zoodmall_account_states = function(data){
    return http(url_zoodmall_account_states,data);
};

//zoodmall账号查看
export const url_get_zoodmall_account = "get|zoodmall-account/:id"
export const api_get_zoodmall_account = function(id){
    return http(Url2(url_get_zoodmall_account,{id:id}));
};

//zoodmall账号编辑
export const url_put_zoodmall_account = "put|zoodmall-account";
export const api_put_zoodmall_account = function(data){
    return http(url_put_zoodmall_account,data);
};

//zoodmall获取订单授权信息
export const url_token_zoodmall_account = "get|zoodmall-account/token/:id"
export const api_token_zoodmall_account = function(id){
    return http(Url2(url_token_zoodmall_account,{id:id}));
};

//zoodmall获取订单授权
export const url_token_zoodmall = "put|zoodmall-account/token";
export const api_token_zoodmall = function(data){
    return http(url_token_zoodmall,data);
};

//批量设置
export const url_post_batch_set = "post|zoodmall-account/batch-set";
export const api_zoodmall_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};