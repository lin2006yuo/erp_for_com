import {http} from '../lib/http-plus';

//获取数据来源
export const url_get_purchase_parcels_abnormal_type = "get|purchase-parcels/abnormal-source";
export const api_get_purchase_parcels_abnormal_type = function () {
    return http(url_get_purchase_parcels_abnormal_type);
};
//获取退回列表数据
export const url_get_purchase_order_return_of_goods_purchase = "get|purchase-order/return-of-goods-purchase";
export const api_get_purchase_order_return_of_goods_purchase = function (data) {
    return http(url_get_purchase_order_return_of_goods_purchase,data);
};
//获取查看编辑信息
export const url_purchase_order_abnormal_id_purchase_mail = "put|purchase-order/:abnormal_id/purchase/mail";
export const api_purchase_order_abnormal_id_purchase_mail = function (abnormal_id, data) {
    return http(Url2(url_purchase_order_abnormal_id_purchase_mail, {abnormal_id}), data);
};

// 凭证上传
export const url_purchase_certificate = "put|purchase-order/:abnormal_id/certificate-by-purchase";
export const api_purchase_certificate = function (abnormal_id, data) {
    return http(Url2(url_purchase_certificate, {abnormal_id}), data);
};
//采购删除包裹退回
export const url_delete_purchase_order_abnormal_id_return_parcel = "delete|purchase-order/:abnormal_id/return-parcel";
export const api_delete_purchase_order_abnormal_id_return_parcel = function (abnormal_id) {
    return http(Url2(url_delete_purchase_order_abnormal_id_return_parcel, {abnormal_id}));
};
