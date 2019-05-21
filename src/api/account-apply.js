/**
 * Created by Administrator on 2017/8/23.
 */
import {http} from '../lib/http-plus';

// //保存成员管理信息
// export const url_post_account_users = "post|account-users";
// export const api_post_account_users = function (data) {
//     return http(Url2(url_post_account_users), data);
// };

// //获取密码
// export const url_get_password = "get|account-apply/password";
// export const api_get_password = function (data) {
//     return http(Url2(url_get_password), data);
// };

// //获取paypal的账号
// export const url_get = "get|paypal-account";
// export const api_get = function (data) {
//     return http(Url2(url_get), data);
// };

//获取服务器已绑定的账号列表
// export const url_get_already = "get|account-apply/already-bind";
// export const api_get_already = function (data) {
//     return http(Url2(url_get_already), data);
// };
//
//
//
// //新*获取注册状态
// export const api_get_account_apply_status = ()=>{
//     return http("get|account-apply/status");
// };
//
// //新*账号申请基本信息（添加）
// export const api_add_account_info = (data)=>{
//     return http("post|account-apply",data);
// };

//新*账号申请基本信息（更新编辑）
// export const url_update_base_info = "put|account-apply/:id";
// export const api_update_base_info =(id,param)=> {
//     return http(Url2(url_update_base_info,{id:id}),param);
// };
//
// //新*账号申请列表编辑
// export const url_account_apply_list_edit = "get|account-apply/:id";
// export const api_account_apply_list_edit =id=> {
//     return http(Url2(url_account_apply_list_edit,{id:id}));
// };
//
// //新*账号申请审核
// export const url_update_audit = "put|account-apply/:id/audit";
// export const api_update_audit =(id,param)=> {
//     return http(Url2(url_update_audit,{id:id}),param);
// };
//
//
// export const url_update_registration = "put|account-apply/:id/result";
// export const api_update_registration =(id,param)=> {
//     return http(Url2(url_update_registration,{id:id}),param);
// };


// //新*注册信息存
// export const url_update_register_info = "put|account-apply/:id/register";
// export const api_update_register_info =(id,param)=> {
//     return http(Url2(url_update_register_info,{id:id}),param);
// };



//新*作废
// export const url_update_nullify_status = "put|account-apply/:id/cancellation";
// export const api_update_nullify_status =(id,param)=> {
//     return http(Url2(url_update_nullify_status,{id:id}),param);
// };

//获取已注册邮箱;
export const api_get_has_used_email = (data)=>{
    return http("get|email/used-list",data);
};


//选中公司后获取手机号服务器。。
export const url_get_server_phone = "get|account-apply/:company_id/:channel_id/relate-info";
export const api_get_server_phone =(company_id,channel_id)=> {
    return http(Url2(url_get_server_phone,{company_id:company_id,channel_id:channel_id}));
};

//获取账号注册流程列表
export const api_get_account_register_list = data=>{
    return http("get|account-apply",data);
};

//获取状态
export const api_get_account_register_status = data=>{
    return http("get|account-apply/status",data);
};

//获取服务器列表
export const api_get_servers = data=>{
    return http("get|servers",data);
};

//获取可用手机号
export const api_get_phone_info = (data)=>{
    return http("get|phone/can-use",data);
};

//新增基本信息
export const api_add_base_info =data=>{
    return http("post|account-apply",data);
};

//获取可用邮箱
export const api_get_email_info = (data)=>{
    return http("get|email/available-list",data);
};

//获取信用卡
export const api_get_credit_card_info =(data)=>{
    return http("get|credit-card",data);
};

//获取当前信用卡绑定账号详情
export const url_get_current_credit_card_detail = "get|credit-card/:id/account-info";
export const api_get_current_credit_card_detail =id=> {
    return http(Url2(url_get_current_credit_card_detail,{id:id}));
};

//更新注册信息
export const url_update_register_info_new = "put|account-apply/:id/register";
export const api_update_register_info_new =(id,param)=> {
    return http(Url2(url_update_register_info_new,{id:id}),param);
};

// 账号申请日志
export const url_get_operation_log = "get|account-apply/:id/log";
export const api_get_operation_log =(id)=> {
    return http(Url2(url_get_operation_log,{id:id}));
};

//更新审核信息
export const url_update_base_info = "put|account-apply/:id";
export const api_update_base_info =(id,param)=> {
    return http(Url2(url_update_base_info,{id:id}),param);
};

//更新审核信息
export const url_update_audit_info_new = "put|account-apply/:id/audit";
export const api_update_audit_info_new =(id,param)=> {
    return http(Url2(url_update_audit_info_new,{id:id}),param);
};

//更新注册结果
export const url_update_register_result = "put|account-apply/:id/result";
export const api_update_register_result =(id,param)=> {
    return http(Url2(url_update_register_result,{id:id}),param);
};

//获取基本信息
export const url_get_base_info = "get|account-apply/:id";
export const api_get_base_info =id=> {
    return http(Url2(url_get_base_info,{id:id}));
};

//获取注册信息
export const url_get_register_info = "get|account-apply/:id/register";
export const api_get_register_info =id=> {
    return http(Url2(url_get_register_info,{id:id}));
};

//获取审核信息
export const url_get_audit_info = "get|account-apply/:id/audit";
export const api_get_audit_info =id=> {
    return http(Url2(url_get_audit_info,{id:id}));
};

//获取注册结果
export const url_get_result_info = "get|account-apply/:id/result";
export const api_get_result_info =id=> {
    return http(Url2(url_get_result_info,{id:id}));
};

//获取密码
// export const api_get_account_password =(data)=>{
//     return http("get|account-apply/password",data);
// };
export const url_get_account_password = "get|account-apply/password";
export const api_get_account_password =data=> {
    return http(Url2(url_get_account_password),data);
};

//获取状态
export const api_get_base_account_status =()=>{
    return http("get|account-basics/changes");
};
//获取收款账号信息
export const url_get_shroff_account_number = "get|account-apply/shroff-account-number";
export const api_shroff_account_number =data=> {
    return http(Url2(api_shroff_account_number),data);
};
