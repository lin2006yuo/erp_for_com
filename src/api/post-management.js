import {http} from '../lib/http-plus';

//邮局管理列表
export const url_get_postoffice="get|postoffice";
export const api_get_postoffice=function(data){
    return http(url_get_postoffice,data);
}
//获取单条邮局号详情记录
export const url_get_single_postoffice="get|postoffice/:id";
export const api_get_single_postoffice=function(id){
    return http(Url2(url_get_single_postoffice,{id:id}))
}

//更新单条记录
export const url_put_postoffice="put|postoffice/:id";
export const api_put_postoffice=function(id,data){
    return http(Url2(url_put_postoffice,{id:id}),data)
}
//新增单条记录
export const url_post_postoffice="post|postoffice";
export const api_post_postoffice=function(data){
    return http(url_post_postoffice,data)}
// 更新状态
export const url_put_status="put|postoffice/:id/status";
export const api_put_status=function(id,data){
    return http(Url2(url_put_status,{id:id}),data)
}
