import {http} from '../lib/http-plus';
//列表
export const url_pandao_account = 'get|pandao-account';
export const api_pandao_account = function (data) {
    return http(url_pandao_account,data);
};

//更新 /pandao-account/update
export const url_update_pandao_account = 'post|pandao-account/update';
export const api_update_pandao_account = function (data) {
    return http(url_update_pandao_account,data);
};
//查看  /pandao-account/:id
export const url_look_pandao_account = 'get|pandao-account/:id';
export const api_look_pandao_account = function (id) {
    return http(Url2(url_look_pandao_account,{id:id}));
};
//更改状态
export const url_change_status = 'post|pandao-account/states';
export const api_change_status = function (data) {
    return http(url_change_status,data);
};
//获取token pandao-account/authorization
export const url_get_authorization = 'post|pandao-account/authorization';
export const api_get_authorization = function (data) {
    return http(url_get_authorization,data);
};
//批量设置
export const url_post_batch_set = "post|pandao-account/batch-set"
export const api_mymall_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};

//获取账号日志
export const url_account_log = "get|pandao-account/log/:id";
export const api_account_log = function(id,data){
    return http(Url2(url_account_log,{id:id}),data);
}