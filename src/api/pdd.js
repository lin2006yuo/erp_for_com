import {http} from '../lib/http-plus';
import {url_token_account} from "@/api/cd-account";

//获取pdd订单列表信息
export const url_pdd_account = "get|pdd-account";
export const api_pdd_account = function(data){
    return http(url_pdd_account,data);
};
//pdd账号查看
export  const url_look_account="get|pdd-account/:id"
export  const api_look_account=function (id) {
    return http(Url2(url_look_account,{id:id}));
}

//pdd账号编辑
export  const url_edit_account="put|pdd-account"
export  const  api_edit_account=function (data) {
    return http(url_edit_account,data)
}
//pdd账号停用
export  const url_api_system_states="post|pdd-account/states"
export  const  api_system_states=function (data) {
    return http(url_api_system_states,data)
}
//pdd授权
export  const url_pdd_authorcode="post|pdd-account/authorcode"
export  const api_pdd_authorcode=function (data) {
    return http(url_pdd_authorcode,data)
}
//获取token
export  const url_account_token="post|pdd-account/token"
export const  api_account_token=function (data) {
    return http(url_account_token,data)
}

//更新token  无文档
export const url_refresh_token = "get|pdd-account/refresh_token/:id";
export const api_refresh_token = function(id){
    return http(Url2(url_refresh_token,{id:id}));
};

//批量编辑
export  const url_update_download="post|pdd-account/update_download"
export const  api_update_download=function (data) {
    return http(url_update_download,data)
}

//获取账号日志
export const url_account_log = "get|pdd-account/log/:id";
export const api_account_log = function(id,data){
    return http(Url2(url_account_log,{id:id}),data);
}