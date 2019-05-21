import {http} from '../lib/http-plus';

//包装作业列表
export const url_allocation_packing_list = "get|packing-manage";
export const api_allocation_packing_list = function (data) {
    return http(url_allocation_packing_list, data);
};

//包装详情获取
export const url_allocation_packing_detail = "post|packing-manage/start-packing";
export const api_allocation_packing_detail = function (data) {
    return http(url_allocation_packing_detail, data);
};

//添加箱子
export const url_allocation_packing_add = "post|packing-manage";
export const api_allocation_packing_add = function (data) {
    return http(url_allocation_packing_add, data);
};

//扫描sku
export const url_allocation_packing_insert = "post|packing-manage/insert-pack-box";
export const api_allocation_packing_insert = function (data) {
    return http(url_allocation_packing_insert, data);
};

//修改sku数量
export const url_allocation_packing_change_quantity = "post|packing-manage/change-quantity";
export const api_allocation_packing_change_quantity = function (data) {
    return http(url_allocation_packing_change_quantity, data);
};

//包装完成
export const url_allocation_packing_finish = "post|packing-manage/packing-finish";
export const api_allocation_packing_finish = function (data) {
    return http(url_allocation_packing_finish, data);
};

//删除包装商品
export const url_allocation_sku_delete = "post|packing-manage/delete-box-detail";
export const api_allocation_sku_delete = function (data) {
    return http(url_allocation_sku_delete, data);
};

//修改箱子尺寸
export const url_allocation_box_change = "post|packing-manage/modify-size";
export const api_allocation_box_change = function (data) {
    return http(url_allocation_box_change, data);
};