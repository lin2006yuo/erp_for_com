/**
 * Created by Administrator on 2018/5/22.
 */
import {http} from '../lib/http-plus';

//获取shopee账号列表
export const url_shopee_account = "get|shopee-account"
export const api_shopee_account = function(data){
    return http(url_shopee_account,data);
};

//查看shopee账户详情
export const url_get_shopee_account = "get|shopee-account/:id"
export const api_get_shopee_account = function(id){
    return http(Url2(url_get_shopee_account,{id:id}));
};


//切换shopee系统状态
export const url_shopee_change_status = "post|shopee-account/change-status"
export const api_shopee_change_status = function(data){
    return http(url_shopee_change_status,data);
};

//保存shopee账户
export const url_post_shopee_change = "post|shopee-account"
export const api_post_shopee_chang = function(data){
    return http(url_post_shopee_change,data);
};

//获取shopee站点
export const url_shopee_site = "get|shopee-account/site"
export const api_shopee_site = function(data){
    return http(url_shopee_site,data);
};

//批量设置
export const url_post_batch_set = "post|shopee-account/batch-set";
export const api_shopee_post_batch_set = function(data){
    return http(url_post_batch_set,data);
};

