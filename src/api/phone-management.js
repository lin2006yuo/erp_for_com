import {http} from '../lib/http-plus';

//获取手机号列表信息
export const get_phone = "get|phone";
export const api_phone = function(data){
    return http(get_phone, data);
};

// 新增-编辑手机号
export const operation_phone = "post|phone";
export const api_operation__phone = function(data){
    return http(operation_phone, data);
};

// 获取单条手机详情况记录
export const get_one_phone = "get|phone/:id";
export const api_one__phone = function(id) {
    return http(Url2(get_one_phone, {id: id}));
};

// 切换状态
export const switch_status = "put|phone/:id/status";
export const api_switch_status = function(id, data) {
    return http(Url2(switch_status, {id: id}), data);
};

// 获取手机号关联的账号。
export const get_accout = "get|phone/:id/accounts";
export const api_accout = function(id) {
    return http(Url2(get_accout, {id: id}));
};
