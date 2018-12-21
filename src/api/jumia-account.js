import {http} from '../lib/http-plus';
import {url_get_walmart_account, url_token_walmart_account} from "@/api/walmart-account";

//3.1获取jumia账号列表
export const url_jumia_account = "get|jumia-account";
export const api_jumia_account = function(data){
    return http(url_jumia_account,data);
};
//3.4  添加jumia账号
export const url_jumia_account_add = "post|jumia-account";
export const api_jumia_account_add = function(data){
    return http(url_jumia_account_add,data);
};
//3.4  查看jumia账号 get|jumia-account/:id

export const url_jumia_account_look = "get|jumia-account/:id";
export const api_jumia_account_look= function(id,data){
    return http(Url2(url_jumia_account_look,{id:id}),data);
};
// 更新 put|jumia-account
export const url_jumia_account_edit = "put|jumia-account";
export const api_jumia_account_edit= function(data){
    return http(url_jumia_account_edit,data);
};
//启用、停用 post|jumia-account/states
export const url_jumia_account_states = "post|jumia-account/states";
export const api_jumia_account_states= function(data){
    return http(url_jumia_account_states,data);
};

//批量设置
export const url_post_batch_set = "post|jumia-account/batch-set";
export const api_jumia_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};