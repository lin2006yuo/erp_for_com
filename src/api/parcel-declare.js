/**
 * Created by RondaFul on 2017/3/10.
 */
import {http} from '../lib/http-plus';
/*-----包裹申报规则列表*/
export const url_declare_list = "get|declare-rules";
export const api_declare_list = function (data) {
    return http(Url2(url_declare_list),data);
};
/*----更改申报规则状态*/
export const url_declare_status = "post|declare-rules/:id/status/:value";
export const api_declare_status = function (id,value) {
    return http(Url2(url_declare_status,{id:id,value:value}));
};
/*----------删除申报规则*/
export const url_declare_del = "delete|declare-rules/:id";
export const api_declare_del = function (id) {
    return http(Url2(url_declare_del,{id:id}));
};
/*---获取默认申报设置资源*/
export const url_declare_rules = "get|declare-rules/defaults";
export const api_declare_rules = function () {
    return http(Url2(url_declare_rules));
};
/*-----获取默认申报设置值*/
export const url_declare_rules_info = "get|declare-rules/info";
export const api_declare__info = function () {
    return http(Url2(url_declare_rules_info));
};
/*---保存默认申报设置*/
export const url_declare_save = "post|declare-rules/keep";
export const api_declare_save = function (data) {
    return http(Url2(url_declare_save),data);
};
/*-----获取规则可选条件*/
export const url_declare_rules_items = "get|declare-rules/items";
export const api_declare__items = function () {
    return http(Url2(url_declare_rules_items));
};
/*-----获取条件资源信息*/
export const url_declare_resources = "post|declare-rules/resources";
export const api_declare_resources = function (data) {
    return http(Url2(url_declare_resources),data);
};
/*-----新增申报规则*/
export const url_declare_add = "post|declare-rules";
export const api_declare_add = function (data) {
    return http(Url2(url_declare_add),data);
};
/*------获取编辑申报规则信息*/
export const url_declare_edit = "get|declare-rules/:id/edit";
export const api_declare_edit = function (id) {
    return http(Url2(url_declare_edit,{id:id}));
};
/*----查看申报规则*/
export const url_declare_look = "get|declare-rules/:id";
export const api_declare_look = function (id) {
    return http(Url2(url_declare_look,{id:id}));
};
/*----更新申报规则*/
export const url_declare_update = "put|declare-rules/:id";
export const api_declare_update = function (id,data) {
    return http(Url2(url_declare_update,{id:id}),data);
};
/*--------排序*/
export const url_declare_sort = "post|declare-rules/sort";
export const api_declare_sort = function (data) {
    return http(Url2(url_declare_sort),data);
};
