import {http} from '../lib/http-plus';

//获取yandex账号列表信息
export const url_yandex_account="get|yandex-account";
export const  api_yandex_account=function (data) {
        return http(url_yandex_account,data)
}

//账号查看
export  const url_look_account="get|yandex-account/:id"
export  const api_look_account=function (id) {
    return http(Url2(url_look_account,{id:id}));
}

//账号添加
export  const url_add_account="post|yandex-account"
export const api_add_account=function (data) {
    return http(url_add_account,data)
}
//账号编辑
export  const url_edit_account="put|yandex-account"
export  const  api_edit_account=function (data) {
   return http(url_edit_account,data)
}
//账号停用
export  const url_api_system_states="post|yandex-account/states"
export  const  api_system_states=function (data) {
    return http(url_api_system_states,data)
}
//获取授权码
// export  const url_authorization="get|yandex-account/token/:id"
// export  const  api_authorization=function (data) {
//     return http(url_authorization,data)
// }
export const url_token_account = "get|yandex-account/token/:id"
export const api_token_account = function(id){
    return http(Url2(url_token_account,id));
};
//获取订单授权
export  const url_authori="put|yandex-account/token"
export  const  api_authori=function (data) {
    return http(url_authori,data)
}