/**
 * Created by RondaFul on 2016/11/16.
 */
import {http} from '../lib/http-plus';

export const url_ymx_list = "get|amazon-account"
export const ymx_list = function(data){
    return http(url_ymx_list,data);
};
export const url_ymx_add = "post|amazon-account"
export const ymx_add = function(data){
    return http(url_ymx_add,data);
};
export const url_ymx_check = "get|amazon-account/:id"
export const ymx_check = function(id){
    return http(Url2(url_ymx_check,{id:id}));
};
export const url_ymx_edit = "get|amazon-account/:id/edit"
export const ymx_edit = function(id){
    return http(Url2(url_ymx_edit,{id:id}));
};
export const url_ymx_update = "put|amazon-account/:id"
export const ymx_update = function(id,data){
    return http(Url2(url_ymx_update,{id:id}),data);
};
export const url_ymx_status = "post|amazon-account/status"
export const ymx_status = function(data){
    return http(url_ymx_status,data);
};
//站点
export const url_ymx_site = "get|amazon/site"
export const ymx_site = function(data){
    return http(url_ymx_site,data);
};

//批量设置
export const url_post_batch_set = "post|amazon-account/set";
export const ymx_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};
//判断站点是否授权
export const url_ymx_site_accredit = "get|amazon-account/get-developer-account/:site";
export const ymx_site_accredit = function(site){
    return http(Url2(url_ymx_site_accredit,{site:site}));
};
//通知信息
export const url_get_notice_info = "get|publish/amazon-notice/notice-info";
export const api_get_notice_info = function(data){
    return http(url_get_notice_info,data);
};
//设置通知
export const url_post_set_amazon_notice = "post|publish/amazon-notice/set-notice";
export const api_post_set_amazon_notice = function(data){
    return http(url_post_set_amazon_notice,data);
};