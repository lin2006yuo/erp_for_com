import {http} from '../lib/http-plus';

//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};

//获取虚拟订单号列表
export const url_order_list = "get|virtual-hold";
export const api_order_list = function (data) {
    return http(Url2(url_order_list), data);
};

export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};

//新增虚拟订单号
export const url_add_order = "post|virtual-hold";
export const api_add_order = function (data) {
    return http(Url2(url_add_order), data);
};

//获取虚拟订单号

export const url_get_order = "get|virtual-hold/:id/edit";
export const api_get_order = function (id,data) {
    return http(Url2(url_get_order, {id:id}), data);
};


//修改虚拟订单号
export const url_updata_order = "put|virtual-hold/:id";
export const api_updata_order = function (id, data) {
    return http(Url2(url_updata_order,{id:id}), data);
};

//删除虚拟订单号
export const url_delete_order = "delete|virtual-hold/:id";
export const api_delete_order = function (id, data) {
    return http(Url2(url_delete_order,{id:id}), data);
};


//批量删除虚拟订单号
export const url_delete_orders = "post|virtual-hold/batch/delete";
export const api_delete_orders = function (data) {
    return http(Url2(url_delete_orders), data);
};

//获取导入模板
export const url_get_import_template = "get|virtual-hold/import-template";
export const api_get_import_template = function (data) {
    return http(url_get_import_template, data);
};

//导入模版
export const url_post_virtual_hold_import_transfer = "post|virtual-hold/batch-import ";
export const api_post_virtual_hold_import_transfer = function(data){
    return http(url_post_virtual_hold_import_transfer,data, {
        contentType:'application/x-www-form-urlencoded',
        timeout:90000
    })
};

