import {http} from '../lib/http-plus';

//获取列表
export const get_up_lower_rule_list = 'get|publish/amazon/up-lower-rule-list';
export const api_up_lower_rule_list = function(data){
    return http(get_up_lower_rule_list, data);
};

//获取定时上下架规则详情
export const get_up_lower_rule_detail = 'get|publish/amazon/up-lower-rule-detail';
export const api_up_lower_rule_detail = function(data){
    return http(get_up_lower_rule_detail, data);
};

//规则删除
export const post_delete_up_lower_rules = 'post|publish/amazon/up-lower-rule-delete';
export const api_delete_up_lower_rules = function(data){
    return http(post_delete_up_lower_rules, data);
};

//添加规则
export const post_add_up_lower_rules = 'post|publish/amazon/add-up-lower-rule';
export const api_add_up_lower_rules = function(data){
    return http(post_add_up_lower_rules, data);
};

//编辑规则
export const post_edit_up_lower_rules = 'post|publish/amazon/up-lower-rule-edit';
export const api_edit_up_lower_rules = function(data){
    return http(post_edit_up_lower_rules, data);
};

//修改状态
export const get_up_lower_rule_status = 'get|publish/amazon/up-lower-rule-status';
export const api_up_lower_rule_status = function(data){
    return http(get_up_lower_rule_status, data);
};

//开启定时上下架
export const post_open_time_up_lower = 'post|publish/amazon/up-lower-open';
export const api_open_time_up_lower = function(data){
    return http(post_open_time_up_lower, data);
};

//关闭定时上下架
export const post_close_time_up_lower = 'post|publish/amazon/up-lower-close';
export const api_close_time_up_lower = function(data){
    return http(post_close_time_up_lower, data);
};