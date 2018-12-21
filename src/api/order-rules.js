/**
 * Created by wuchuguang on 16-12-15.
 */

import {http} from '../lib/http-plus';

export const url_get = "get|rules";
export const api_get = function (params) {
    return http(Url2(url_get), params);
};

export const url_del = "delete|rules/:id";
export const api_del = function (id) {
    return http(Url2(url_del,{id:id}));
};

export const url_sort = "post|rules/sort";
export const api_sort = function (sorts) {
    return http(Url2(url_sort), sorts);
};

export const url_add = "post|rules";
export const api_add = function (params) {
    return http(Url2(url_add), params);
};

export const url_lookup = "get|rules/:id";
export const api_lookup = function (id) {
    return http(Url2(url_lookup, {id:id}));
};

// 更改订单规则状态
export const url_change_status = "post|rules/status";
export const api_change_status = function (id, status) {
    return http(Url2(url_change_status), {id:id, status:status});
};

export const url_update = "put|rules/:id";
export const api_update = function (id, datas) {
    return http(Url2(url_update, {id:id}), datas);
};

//获取分配发货仓库信息
export const url_getwarehouse = "get|rules/warehouse";
export const api_getwarehouse = function () {
    return http(Url2(url_getwarehouse));
};

// 获取邮寄方式
export const url_getshipping = "get|shipping-method/list-rule";
export const api_getshipping = function (data) {
    return http(Url2(url_getshipping),data);
};

//获取规则可选条件
export const url_rule_items = "get|rule-items";
export const api_rule_items = function () {
    return http(Url2(url_rule_items));
};

export const url_getaction = "get|rules/action";
export const api_getaction = function () {
    return http(Url2(url_getaction));
};

export const url_getchannel = "get|channel-categories";
export const api_getchannel = function () {
    return http(Url2(url_getchannel));
};
//获取条件资源信息 请求时间设置为1分钟
export const url_get_resource = "post|rules/resources";
export const api_get_resource = function (datas) {
    return http(url_get_resource, datas,{
        contentType:'application/x-www-form-urlencoded',
        timeout:60000
    });
};
export const url_copy = "post|rules/copy";
export const api_copy = function (id, name) {
    return http(Url2(url_copy), {id:id, name:name});
};
//获取邮寄方式
export const url_shiping = "get|rules/shipping";
export const api_shiping = function () {
    return http(Url2(url_shiping));
};
//列表邮寄方式
export const url_list_shiping = "get|shipping-method/list-order";
export const api_list_shiping = function () {
    return http(Url2(url_list_shiping));
};
//规则日志
export const url_get_log = "get|rules/:id/log";
export const api_get_log = function (id) {
    return http(Url2(url_get_log, {id:id}));
};
//排序日志
export const url_get_sort_log = "get|rules/:rule_id/log";
export const api_get_sort_log = function () {
    return http(url_get_sort_log,{rule_id:0});
};

//默认规则
export const url_acquire_default_rule = "get|rules/default";
export const api_acquire_default_rule = data=> {
    return http(url_acquire_default_rule,data);
};
//批量修改运输方式
export const url_batch_shipping = "post|rules/batch/shipping";
export const api_batch_shipping = (data)=> {
    return http(url_batch_shipping,data);
};
