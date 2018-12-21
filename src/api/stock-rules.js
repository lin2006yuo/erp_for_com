/**
 * Created by zhangzhiyong on 18-8-21.
 */


import {http} from '../lib/http-plus';

//获取审核规则列表
export const url_stock_rules = "get|stock-rules";
export const api_stock_rules = function () {
    return http(url_stock_rules);
};

//审核规则排序
export const url_stock_rules_sort = "post|stock-rules/sort";
export const api_stock_rules_sort = function (sorts) {
    return http(url_stock_rules_sort, sorts);
};


/*
export const url_change_status = "post|stock-rules/:id/status/:status";
export const api_change_status = function (id, status) {
    return http(Url2(url_change_status, {id, status}));
};
*/

//删除规则
export const url_del_stock_rule = "delete|stock-rules/:id";
export const api_del_stock_rule = function (id) {
    return http(Url2(url_del_stock_rule, {id: id}));
};

//保存规则
export const url_save_stock_rule = "post|stock-rules";
export const api_save_stock_rule = function (params) {
    return http(url_save_stock_rule, params);
};

//更新规则
export const url_update_stock_rule = "put|stock-rules/:id";
export const api_update_stock_rule = function (id, params) {
    return http(Url2(url_update_stock_rule, {id}), params);
};

//获取规则单页
export const url_look_stock_rule = "get|stock-rules/:id/edit";
export const api_look_stock_rule = function (id) {
    return http(Url2(url_look_stock_rule, {id: id}));
};

//获取详细规则列表
export const url_stock_rule_items = "get|stock-rules-items";
export const api_stock_rule_items = function () {
    return http(url_stock_rule_items);
};

//获取详情
export const url_get_stock_resource = "post|stock-rules/resources";
export const api_get_stock_resource = function (params) {
    return http(url_get_stock_resource, params);
};

//修改状态
export const url_change_stock_status = "post|stock-rules/:id/status/:value";
export const api_change_stock_status = function (id, value) {
    return http(Url2(url_change_stock_status, {id: id, value: value}));
};

/*
export const url_approver = "get|user";
export const api_approver = function (query) {
    return http(Url2(url_approver), {snType: 'realname', snText: query});
}*/
