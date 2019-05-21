/**
 * Created by Administrator on 2017/6/10.
 */
import {http} from '../lib/http-plus';

export const parcel_get = "get|purchase-parcels/getParcelList";
export const api_parcel_get = function (params) {
    return http(Url2(parcel_get), params);
};

export const url_parcel_getOrder ="get|purchase-parcels/getPurchaseParcelDetail";
export const api_parcel_getOrder = function (params) {
    return http(Url2(url_parcel_getOrder), params);
};

export const url_parcel_searchOrder = "get|purchase-parcels/getParcelList";
export const api_parcel_searchOrder = function (params) {
    return http(Url2(url_parcel_searchOrder), params);
};

export const url_parcel_delete = "post|purchase-parcels/deletePurchaseParcel";
export const api_parcel_delete = function (params) {
    return http(Url2(url_parcel_delete), params);
};

export const url_parcel_update = "post|purchase-parcels/updatePurchaseParcelByField";
export const api_parcel_update = function (params) {
    return http(Url2(url_parcel_update), params);
};

export const url_user_warehouse = "get|user/warehouse/staffs";
export const api_user_warehouse = function (params) {
    return http(Url2(url_user_warehouse), params);
};

//查询包裹导出
export const url_purchase_search_export = "post|purchase-parcels/export";
export const api_purchase_search_export = function (data) {
    return http(url_purchase_search_export, data);
};

// 获取具体异常类型
export const url_abnormal_type = "get|purchase-parcels/abnormal-type";
export const api_abnormal_type = function () {
    return http(url_abnormal_type);
};

// 标记异常
export const url_mark_parcel_abnormal = "post|purchase-parcels/parcel-abnormal";
export const api_mark_parcel_abnormal = function (data) {
    return http(url_mark_parcel_abnormal, data);
};

// 获取异常来源
export const url_abnormal_source = "get|purchase-parcels/abnormal-source";
export const api_abnormal_source = function () {
    return http(url_abnormal_source);
};

//异常处理正常
export const url_abnormal_deal_unopened = "put|purchase-parcels/unopened";
export const api_abnormal_deal_unopened = function (data) {
    return http(url_abnormal_deal_unopened, data);
};
