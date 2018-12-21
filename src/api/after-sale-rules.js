/**
 * Created by wuchuguang on 16-12-15.
 */

import {http} from '../lib/http-plus';

//获取售后规则列表
export const url_get_after_sale_rules = "get|after-sale-rules";
export const api_get_after_sale_rules = function (params) {
    return http(url_get_after_sale_rules, params);
};
//删除售后规则
export const url_delete_after_sale_rules_id = "delete|after-sale-rules/:id";
export const api_delete_after_sale_rules_id = function (id) {
    return http(Url2(url_delete_after_sale_rules_id,{id}));
};
//获取规则可选条件
export const url_get_after_sale_rules_rule_item = "get|after-sale-rules/rule-item";
export const api_get_after_sale_rules_rule_item = function () {
    return http(url_get_after_sale_rules_rule_item);
};
//新增规则
export const url_post_after_sale_rules = "post|after-sale-rules";
export const api_post_after_sale_rules = function (params) {
    return http(url_post_after_sale_rules, params);
};
//更新规则
export const url_put_after_sale_rules_id = "put|after-sale-rules/:id";
export const api_put_after_sale_rules_id = function (id,params) {
    return http(Url2(url_put_after_sale_rules_id,{id}), params);
};
//查看售后规信息
export const url_get_after_sale_rules_id = "get|after-sale-rules/:id";
export const api_get_after_sale_rules_id = function (id) {
    return http(Url2(url_get_after_sale_rules_id,{id}));
};
//保存售后规则排序
export const url_post_after_sale_rules_sort = "post|after-sale-rules/sort";
export const api_post_after_sale_rules_sort = function (data) {
    return http(url_post_after_sale_rules_sort,data);
};
//停用/启用售后规则
export const url_post_after_sale_rules_status = "post|after-sale-rules/status";
export const api_post_after_sale_rules_status = function (data) {
    return http(url_post_after_sale_rules_status,data);
};
//获取平台
export const url_get_after_sale_rules_hannel = "get|after-sale-rules/channel";
export const api_get_after_sale_rules_hannel = function (data) {
    return http(url_get_after_sale_rules_hannel,data);
};
