
import {http} from '../lib/http-plus';
import {url_read} from "@/api/release";

//获取列表
export const url_channel = 'get|channel';
export const api_channel = function (data) {
    return http(url_channel ,data);
};

//系统状态
export const url_channel_states = "post|channel/states"
export const api_channel_states = function(data){
    return http(url_channel_states,data);
};

//添加平台
export const url_post_channel = "post|channel"
export const api_post_channel = function(data){
    return http(url_post_channel,data);
};

//查看
export const url_get_channel = "get|channel/:id"
export const api_get_channel = function(id){
    return http(Url2(url_get_channel,{id}));
}; 

//编辑
export const url_put_channel = "put|channel/:id"
export const api_put_channel = function(id,data){
    return http(Url2(url_put_channel,{id}),data);
};
//获取相关渠道的部门
export const url_get_departments="get|channel/:id/departments"
export const api_get_departments=function(id){
    return http(Url2(url_get_departments,{id:id}));
}
//获取渠道占比信息
export const url_get_proportion="get|channel/:id/proportion"
export const api_get_proportion=function(id){
    return http(Url2(url_get_proportion,{id:id}));
}
//保存渠道占比信息
export const url_post_proportion="post|channel/:id/proportion"
export const api_post_proportion=function(id,data){
    return http(Url2(url_post_proportion,{id:id}),data);
}

//获取平台参数
export const url_get_platform_param="get|channel/system-list";
export const api_get_platform_param=id=>{
    return http(url_get_platform_param,id);
};

//保存平台参数
export const url_save_platform_param="post|channel/:id/use-config";
export const api_save_platform_param=(id,data)=>{
    return http(Url2(url_save_platform_param,{id:id}),data);
};

//获取平台配置信息
export const url_get_platform_config="get|channel/:channel_id/config";
export const api_get_platform_config=(channel_id,data)=>{
    return http(Url2(url_get_platform_config,{channel_id:channel_id}),data);
};

//删除某个配置
export const url_delete_single_config="delete|channel/config";
export const api_delete_single_config=id=>{
    return http(url_delete_single_config,id);
};

//更新平台配置信息
export const url_update_platform_config = "put|channel/:channel_id/config";
export const api_update_platform_config = (channel_id,data)=>{
    return http(Url2(url_update_platform_config,{channel_id:channel_id}),data);
};
