import {http} from '../lib/http-plus';
//获取paytm账号列表
export const url_cd_account = "get|cd-account";
export const api_cd_account = function(data){
    return http(url_cd_account,data);
};

//CD账号新增
export const url_add_update_account = "post|cd-account";
export const api_add_update_account = function(data){
    return http(url_add_update_account,data);
};

//CD账号编辑
export const url_add_edit_account = "put|cd-account";
export const api_add_edit_account = function(data){
    return http(url_add_edit_account,data);
};

//CD账号启用停用
export const url_system_states = "post|cd-account/states"
export const api_system_states = function(data){
    return http(url_system_states,data);
};

//CD账号查看
export const url_look_account = "get|cd-account/:id"
export const api_look_account = function(id){
    return http(Url2(url_look_account,{id:id}));
};

//CD获取订单授权信息
export const url_token_account = "get|cd-account/token/:id"
export const api_token_account = function(id){
    return http(Url2(url_token_account,{id:id}));
};

//CD获取订单授权
export const url_token_paytm = "put|cd-account/token";
export const api_token_paytm = function(data){
    return http(url_token_paytm,data);
};

//批量设置
export const url_post_batch_set = "post|cd-account/batch-set"
export const api_cd_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};
//验证
export const url_cd_account_check = "post|cd-account/check";
export const api_cd_account_check = function (data) {
    return http(url_cd_account_check,data)
}