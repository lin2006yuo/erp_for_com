import {http} from '../lib/http-plus';

//软件管理软件类型
export const api_get_server_software_type = ()=>{
    return http("get|software/type");
};

//软件管理列表
export const api_get_server_software_list = (data)=>{
    return http("get|server-software",data);
};

//更新客户端版本
export const api_update_server_version = (data)=>{
    return http("post|server-software/batch/update",data);
};

//更改列表升级状态
export const url_update_software_status = "post|server-software/:id/status";
export const api_update_software_status = (id,data)=> {
    return http(Url2(url_update_software_status, {id:id}),data);
};