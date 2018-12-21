
import {http} from '../lib/http-plus';

//公司资料列表
export const api_get_company_info_list = (data)=>{
    return http("get|account-company",data);
};

//公司名称
export const api_get_company_name = ()=>{
    return http("get|account-company/company");
};

//适用平台
export const api_get_channel = ()=>{
    return http("get|orders/channel");
};

//添加公司资料，新增
export const api_add_company_info = (data)=>{
    return http("post|account-company",data);
};

//列表查看编辑
export const url_get_detail_info = "get|account-company/:id";
export const api_get_company_detail_info = (id)=> {
    return http(Url2(url_get_detail_info, {id:id}));
};
//账号信息保存、更新
export const url_keep_company_account = "put|account-company/:id/account";
export const api_keep_company_account = (id,data)=> {
    return http(Url2(url_keep_company_account, {id:id}),data);
};


//获取操作日志account-company/:id/log
export const url_get_account_log = "get|account-company/:id/log";
export const api_get_account_log = (id)=> {
    return http(Url2(url_get_account_log, {id:id}));
};


//公司信息更新
export const url_update_company_info = "put|account-company/:id";
export const api_update_company_info = (id,data)=> {
    return http(Url2(url_update_company_info, {id:id}),data);
};

//VAT更新保存
export const url_keep_update_vat = "put|account-company/:id/vat";
export const api_keep_update_vat = (id,data)=> {
    return http(Url2(url_keep_update_vat, {id:id}),data);
};
//获取平台公司资料
export const api_get_channel_company_info = (data)=>{
    return http("get|account-company/company",data);
};


//更改资料列表状态/
export const url_update_list_status = "post|account-company/:id/status";
export const api_update_list_status = (id,data)=> {
    return http(Url2(url_update_list_status, {id:id}),data);
};