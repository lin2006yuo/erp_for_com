/**
 * Created by Administrator on 2019/2/23.
 */

import {http} from "@/lib/http-plus";

//获取 daraz 账号列表
export const url_daraz_account = "get|daraz-account";
export const api_daraz_account = function (data) {
    return http(url_daraz_account, data);
};

//daraz账号查看
export const url_get_daraz_read = "get|araz-account/read:id";
export const api_get_daraz_read = function (id) {
    return http(Url2(url_get_daraz_read,{id:id}));
};

//daraz账号编辑
export const url_daraz_account_update = "put|daraz-account/:id";
export const api_daraz_account_update = function (id,data) {
    return http(Url2(url_daraz_account_update,{id:id}),data);
};

//daraz账号授权
export const url_change_authorization = "put|daraz-account/authorization";
export const api_change_authorization = function (data) {
    return http(url_change_authorization,data);
};

//daraz账号启用停用
export const url_change_status = "post|daraz-account/change-status";
export const api_change_status = function (data) {
    return http(url_change_status,data);
};

//daraz账号站点
export const url_change_sites = "get|daraz-account/sites";
export const api_change_sites = function () {
    return http(url_change_sites);
};