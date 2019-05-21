import {http} from '../lib/http-plus';
//获取umka账号列表信息
export const url_umka_account = "get|umka-account";
export const api_umka_account = function (data) {
    return http(url_umka_account,data)
};
export const url_umka_look = "get|umka-account/:id";
export const api_umka_look = function (id) {
    return http(Url2(url_umka_look,{id:id}))
};
export const url_umka_edit = "put|umka-account";
export const api_umka_edit = function (data) {
    return http(url_umka_edit,data)
};
export const url_umka_disable = "post|umka-account/states";
export const api_umka_disable = function (data) {
    return http(url_umka_disable,data)
};
export const url_umka_token = "post|umka-account/token";
export const api_umka_token = function (data) {
    return http(url_umka_token,data)
}

//批量编辑
export const url_update_download = "post|umka-account/update_download";
export const api_update_download = function (data) {
    return http(url_update_download,data)
}

//获取账号日志
export const url_account_log = "get|umka-account/log/:id";
export const api_account_log = function(id,data){
    return http(Url2(url_account_log,{id:id}),data);
}