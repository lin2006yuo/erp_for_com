import {http} from '../lib/http-plus';

//获取箱子列表
export const url_allocation_box_list = "get|allocation-box";
export const api_allocation_box_list = function (data) {
    return http(url_allocation_box_list, data);
};

//添加箱子
export const url_allocation_box_add = "post|allocation-box";
export const api_allocation_box_add = function (data) {
    return http(url_allocation_box_add, data);
};

//修改箱子
export const url_allocation_box_edit = "put|allocation-box/:id";
export const api_allocation_box_edit = function (id, data) {
    return http(Url2(url_allocation_box_edit,{id}), data);
};

//删除箱子
export const url_allocation_box_delete = "delete|allocation-box/:id";
export const api_allocation_box_delete = function (id) {
    return http(Url2(url_allocation_box_delete, {id}));
};

//更新状态
export const url_allocation_box_status = "put|allocation-box/:id/status";
export const api_allocation_box_status = function (id, data) {
    return http(Url2(url_allocation_box_status, {id}), data);
};