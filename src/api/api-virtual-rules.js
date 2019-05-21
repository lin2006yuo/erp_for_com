import {http} from '../lib/http-plus';
export const url_rules_channel = 'get|virtual-rules/channel';
export const api_rules_channel = function () {
    return http(url_rules_channel)
};
//
export const url_virtual_rules_list = 'get|virtual-rules';
export const api_virtual_rules_list = function (data) {
    return http(url_virtual_rules_list,data)
};
//获取规则可选条件
export const url_virtual_rule_items = 'get|virtual-rule-items';
export const api_virtual_rule_items = function (data) {
    return http(url_virtual_rule_items,data)
};
//获取设定动作信息
export const url_virtual_rules_action = 'get|virtual-rules/action';
export const api_virtual_rules_action = function (data) {
    return http(url_virtual_rules_action,data)
};
//获取条件资源信息
export const url_virtual_rules_resources = 'post|virtual-rules/resources';
export const api_virtual_rules_resources = function (data) {
    return http(url_virtual_rules_resources,data)
};
//新增订单自动规则
export const url_add_virtual_rules = 'post|virtual-rules';
export const api_add_virtual_rules = function (data) {
    return http(url_add_virtual_rules,data)
};
//更新订单自动规则
export const url_update_virtual_rules = 'put|virtual-rules/:id';
export const api_update_virtual_rules = function (id,data) {
    return http(Url2(url_update_virtual_rules,{id:id}),data)
};
//删除订单规则
export const url_del_virtual_rules = 'delete|virtual-rules/:id';
export const api_del_virtual_rules = function (id) {
    return http(Url2(url_del_virtual_rules,{id:id}))
};
//复制
export const url_rules_copy = 'post|virtual-rules/copy';
export const api_rules_copy = function (data) {
    return http(url_rules_copy,data)
};
//编辑
export const url_edit_rules = 'get|virtual-rules/:id/edit';
export const api_edit_rules = function (id) {
    return http(Url2(url_edit_rules,{id:id}))
};
//查看
export const url_lookup = 'get|virtual-rules/:id';
export const api_lookup = function (id) {
    return http(Url2(url_lookup,{id:id}))
};
//订单规则日志
export const url_log = 'get|virtual-rules/:rule_id/log';
export const api_log = function (rule_id) {
    return http(Url2(url_log,{rule_id:rule_id}))
};
//停用/启用订单规则
export const url_change_status = 'post|virtual-rules/status';
export const api_change_status = function (data) {
    return http(url_change_status,data)
};


