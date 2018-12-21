/**
 * Created by RondaFul on 2017/4/11.
 */
import {http} from '../lib/http-plus';
//获取table 数据
export const url_send_rules_list = "get|msg-rule";
export const api_send_rules_list = function(data) {
    return http(url_send_rules_list, data);
};

//获取平台
export const url_get_rules_channels = "get|channel-part";
export const api_get_rules_channels = function(data) {
    return http(url_get_rules_channels, data);
};

//新增站内信规则
export const url_add_send_rules = "post|msg-rule";
export const api_add_send_rules = function(data) {
    return http(url_add_send_rules, data);
};
//编辑站内信规则
export const url_edit_send_rules ="get|msg-rule/:id/edit";
export const api_edit_send_rules = function(id) {
    return http(Url2(url_edit_send_rules,{id:id}));
};
//更新站内信规则
export const url_update_send_rules ="put|msg-rule/:id";
export const api_update_send_rules = function(id,data) {
    return http(Url2(url_update_send_rules,{id:id}),data);
};
//删除站内信规则
export const url_del_send_rules ="delete|msg-rule/:id";
export const api_del_send_rules = function(id) {
    return http(Url2(url_del_send_rules,{id:id}));
};
//启用停用站内信规则
export const url_statues_send_rules ="post|msg-rule/batch/update";
export const api_statues_send_rules = function(data) {
    return http(url_statues_send_rules,data);
};
//保存排序功能
export const url_sort_send_rules ="post|msg-rule/changeSort";
export const api_sort_send_rules = function(data) {
    return http(url_sort_send_rules,data);
};
//获取触发时间列表
export const url_send_rules_tree = "get|msg-rule/triggerStatistics";
export const api_send_rules_tree = function() {
    return http(url_send_rules_tree);
};
//获取编辑新增时间列表
export const url_send_rules_addtime = "get|msg-rule/triggerRules";
export const api_send_rules_addtime = function() {
    return http(url_send_rules_addtime);
};
//获取发送邮寄规则列表
export const url_send_rules_email = "get|msg-rule/emailRules";
export const api_send_rules_email = function(data) {
    return http(url_send_rules_email,data);
};
//获取站内信自动发送规则条件
export const url_send_rules_item = "get|msg-rule-items";
export const api_send_rules_item = function() {
    return http(url_send_rules_item);
};
//获取条件资源信息 请求时间设置为1分钟
export const url_send_rules_resources = "post|rules/resources";
export const api_send_rules_resources = function(data) {
    return http(url_send_rules_resources,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:60000
    });
};
//-------回复模板列表
export const url_getTemplates ="get|msg-tpl/getAllTpls";
export const api_getTemplates = function(data) {
    return http(url_getTemplates,data);
};
