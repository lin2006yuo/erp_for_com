/**
 * Created by Administrator on 2019/3/13.
 */

import {http} from "@/lib/http-plus";

//获取 funmart 账号列表
export const url_funmart_account = "get|funmart-account";
export const api_funmart_account = function (data) {
    return http(url_funmart_account, data);
};

//funmart 账号编辑
export const url_put_funmart_account = "put|funmart-account/:id";
export const api_put_funmart_account = function (id,data) {
    return http(Url2(url_put_funmart_account,{id:id}),data);
};

//funmart 账号查看
export const url_get_funmart = "get|funmart-account/:id";
export const api_get_funmart = function (id) {
    return http(Url2(url_get_funmart,{id:id}));
};

//funmart 账号授权
export const url_funmart_authorize = "put|funmart-account-token/:id";
export const api_funmart_authorize = function (id,data) {
    return http(Url2(url_funmart_authorize,{id:id}),data);
};
//funmart日志
export const url_funmart_account_log = "get|funmart-account/log/:id";
export const api_funmart_account_log = function(id){
    return http(Url2(url_funmart_account_log,{id:id}));
};
//funmart批量设置
export const url_funmart_batch_set = "post|funmart-account/batch-set";
export const api_funmart_batch_set = function(data){
    return http(url_funmart_batch_set,data);
};

// oberlo 账号启用停用
export const url_funmart_status = "post|funmart-account/change-status";
export const api_funmart_status = function (data) {
    return http(url_funmart_status,data);
};






