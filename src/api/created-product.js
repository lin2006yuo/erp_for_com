import {http} from '../lib/http-plus';
export const url_save_goods = 'post|goods-pre-dev';
export const api_save_goods = function(data){
    return http(url_save_goods,data)
}

export const url_get_channel = 'get|goods-pre-dev/channel';
export const api_get_channel = function(){
    return http(url_get_channel)
}
/*获取详情 */
export const url_get_detail = 'get|goods-pre-dev/:id';
export const api_get_detail = function(id){
    return http(Url2(url_get_detail,{id:id}))
}
/*审核*/
export const url_post_audit = 'post|goods-pre-dev/audit';
export const api_post_audit = function(data){
    return http(url_post_audit,data)
}
/*获取日志列表 /goods-pre-dev/log/:id(\d+)*/
export const url_get_logs = 'get|goods-pre-dev/log/:id';
export const api_get_logs = function(id){
    return http(Url2(url_get_logs,{id:id}))
}
