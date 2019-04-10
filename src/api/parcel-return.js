import {http} from '../lib/http-plus';

// 包裹退回列表
export const url_return_goods_warehouse = "get|purchase-parcels/return-of-goods-warehouse";
export const api_return_goods_warehouse = function (data) {
    return http(url_return_goods_warehouse, data);
};

// 邮寄信息编辑/提交
export const url_warehouse_mail = "put|purchase-parcels/:abnormal_id/warehouse/mail";
export const api_warehouse_mail = function (abnormal_id, data) {
    return http(Url2(url_warehouse_mail, {abnormal_id}), data);
};