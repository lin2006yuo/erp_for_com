
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
