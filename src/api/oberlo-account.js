/**
 * Created by Administrator on 2019/3/10.
 */

import {http} from "@/lib/http-plus";

//获取 oberlo 账号列表
export const url_oberlo_account = "get|oberlo-account";
export const api_oberlo_account = function (data) {
    return http(url_oberlo_account, data);
};

// oberlo 账号启用停用
export const url_change_status = "post|oberlo-account/change-status";
export const api_change_status = function (data) {
    return http(url_change_status,data);
};

//oberlo 账号查看
export const url_get_oberlo = "get|oberlo-account/:id";
export const api_get_oberlo = function (id) {
    return http(Url2(url_get_oberlo,{id:id}));
};

//oberlo 账号编辑
export const url_oberlo_update = "post|oberlo-account/update";
export const api_oberlo_update = function (data) {
    return http(url_oberlo_update,data);
};

//oberlo 账号授权
export const url_oberlo_authorize = "post|oberlo-account/authorize";
export const api_oberlo_authorize = function (data) {
    return http(url_oberlo_authorize,data);
};
