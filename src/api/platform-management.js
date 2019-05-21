
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
//获取平台参数信息
export const url_get_channel_config="get|channel/:channel_id/config"
export const api_get_channel_config=function(id){
    return http(Url2(url_get_channel_config,{channel_id:id}));
}
//获取添加参数列表
export const url_get_channel_system_list="get|channel/system-list"
export const api_get_channel_system_list=function(data){
    return http(url_get_channel_system_list,data);
}
//更新添加参数
export const url_post_use_config="post|channel/:id/use-config"
export const api_post_use_config=function(id,data){
    return http(Url2(url_post_use_config,{id:id}),data);
}
//更新平台参数
export const url_put_config="put|channel/:channel_id/config"
export const api_put_config=function(id,data){
    return http(Url2(url_put_config,{channel_id:id}),data);
}
//删除平台参数
export const url_delete_config="delete|channel/config"
export const api_delete_config=function(data){
    return http(url_delete_config,data);
}
//-------------------------------------- 平台分配

// 获取展示的产品状态
export const url_get_distribution="get|channel-distribution/status"
export const api_get_distribution=function(){
    return http(url_get_distribution)
}
//获取一级分类
export const url_get_first_categories="get|channel-distribution/first-categories"
export const api_get_first_categories=function(){
    return http(url_get_first_categories)
}
//获取站点
export const url_get_sites="get|channel-distribution/:id/sites"
export const api_get_sites=function(id){
    return http(Url2(url_get_sites,{id:id}))
}
//获取平台帐号
export const url_get_accounts="get|channel-distribution/:id/accounts"
export const api_get_accounts=function(id,data){
    return http(Url2(url_get_accounts,{id:id}),data);
}
//获取平台部门
export const url_get_deps="get|channel-distribution/:id/departments"
export const api_get_deps=function(id){
    return http(Url2(url_get_deps,{id:id}))
}
//获取受限职位
export const url_get_position="get|channel-distribution/positions"
export const api_get_position=function(){
    return http(Url2(url_get_position))
}
//整个保存
export const url_put_distribution="put|channel-distribution/:id"
export const api_put_distribution=function(id,data){
    return http(Url2(url_put_distribution,{id:id}),data)
}
//整个读取
export const url_get_channel_distribution="get|channel-distribution/:id"
export const api_get_channel_distribution=function(id){
    return http(Url2(url_get_channel_distribution,{id:id}))
};
//导入筛选
export const url_import_excel="post|channel-distribution/:id/import"
export const api_import_excel=function(id,data){
    return http(Url2(url_import_excel,{id:id}),data)
};

/** 获取导入的模板*/
export const url_export_excel = "get|download-template";
export const api_export_excel = function () {
    return http(url_export_excel);
};


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
