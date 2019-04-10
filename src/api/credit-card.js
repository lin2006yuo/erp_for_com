/**
 * Created by Administrator on 2019/3/4.
 */

import {http} from "@/lib/http-plus";

//获取信用卡列表
export const url_credit_card = "get|credit-card";
export const api_credit_card = function (data) {
    return http(url_credit_card, data);
};

//添加信用卡
export const url_add_credit_card = "post|credit-card";
export const api_add_credit_card = function (data) {
    return http(url_add_credit_card, data);
};

//获取银行信息
export const url_bank_account = "get|bank-account/bank";
export const api_bank_account = function () {
    return http(url_bank_account);
};

//查看信用卡记录
export const url_card_edit = "get|credit-card/:id/edit";
export const api_card_edit = function (id) {
    return http(Url2(url_card_edit,{id:id}));
};

//编辑更新信用卡记录
export const url_card_update = "post|credit-card/:id/update";
export const api_card_update = function (id,data) {
    return http(Url2(url_card_update,{id:id}),data);
};

//删除信用卡
export const url_card_delete = "delete|credit-card/:id/del";
export const api_card_delete = function (id) {
    return http(Url2(url_card_delete,{id:id}));
};

//获取信用卡类别
export const url_card_category = "get|credit-card/category";
export const api_card_category = function () {
    return http(url_card_category);
};