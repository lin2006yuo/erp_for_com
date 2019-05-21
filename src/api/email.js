
import {http} from '../lib/http-plus';

//邮箱管理列表
export const api_get_email_list = (data)=>{
    return http("get|email",data);
};

//邮箱管理单条记录
export const url_put_email = "put|email/:id";
export const api_put_email = (id,data)=> {
    return http(Url2(url_put_email, {id:id}),data);
};

//批量修复错误信息
export const api_batch_error_msg = (data)=>{
    return http("put|email/batch/error-msg",data);
};

//获取邮箱类型
export const api_available_list = (data)=>{
    return http("get|postoffice/available-list",data);
};

//适用平台
export const api_get_channel = ()=>{
    return http("get|orders/channel");
};

// 新增
export const api_post_email = (data)=>{
    return http("post|email",data);
};

// 获取单条邮箱号详情记录
export const url_get_email = "get|email/:id";
export const api_get_email = (id)=> {
    return http(Url2(url_get_email, {id:id}));
};

//获取密码
export const url_get_password = "get|email/:id/password";
export const api_get_password = function (id,data) {
    return http(Url2(url_get_password,{id:id}),data);
};

//查看账号数
export const url_get_accounts = "get|email/:id/accounts";
export const api_get_accounts = function (id,data) {
    return http(Url2(url_get_accounts,{id:id}),data);
};

//重新生成邮箱前缀
export const url_email_prefix = "get|email/email-prefix";
export const api_email_prefix = function () {
    return http(url_email_prefix);
};