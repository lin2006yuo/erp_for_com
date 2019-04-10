import {http} from '../lib/http-plus';


//注册状态列表
export const api_get_register_status = ()=>{
    return http("get|register-company/status");
};

//注册公司列表
export const api_get_register_company_list = (data)=>{
    return http("get|register-company",data);
};

//添加法人信息
// export const api_add_corporation_info = (data)=>{
//     return http("post|register-company/legal-info",data);
// };
export const url_add_corporation_info = "post|register-company/legal-info";
export const api_add_corporation_info = data=>{
    return http(Url2(url_add_corporation_info),data);
};

//更新法人信息
export const url_update_corporation_info="put|register-company/:id/legal-info";
export const api_update_corporation_info=(id,data)=>{
    return http(Url2(url_update_corporation_info,{id:id}),data);
};

//获取法人信息
export const url_get_corporation_info="get|register-company/:id/legal-info";
export const api_get_corporation_info=id=>{
    return http(Url2(url_get_corporation_info,{id:id}));
};

// //公司类型
// export const api_get_company_type=()=>{
//     return http("get|account-company/type");
// };

// //公司资料来源
// export const api_get_company_source=()=>{
//     return http("get|account-company/source");
// };

//保存公司信息
export const url_save_company_info="put|register-company/:id/company-info";
export const api_save_company_info=(id,data)=>{
    return http(Url2(url_save_company_info,{id:id}),data);
};

//获取公司信息
export const url_get_company_info="get|register-company/:id/company-info";
export const api_get_company_info=id=>{
    return http(Url2(url_get_company_info,{id:id}));
};

//获取营业执照
export const url_get_business_licence_info="get|register-company/:id/charter";
export const api_get_business_licence_info=id=>{
    return http(Url2(url_get_business_licence_info,{id:id}));
};

//保存营业执照
export const url_save_business_licence="put|register-company/:id/charter";
export const api_save_business_licence=(id,data)=>{
    return http(Url2(url_save_business_licence,{id:id}),data);
};

//保存结账信息
export const url_save_balance_info="put|register-company/:id/settlement";
export const api_save_balance_info=(id,data)=>{
    return http(Url2(url_save_balance_info,{id:id}),data);
};

//获取结账信息
export const url_get_balance_info="get|register-company/:id/settlement";
export const api_get_balance_info=id=>{
    return http(Url2(url_get_balance_info,{id:id}));
};

//获取操作日志信息
export const url_get_operation_info="get|register-company/:id/logs";
export const api_get_operation_info=id=>{
    return http(Url2(url_get_operation_info,{id:id}));
};