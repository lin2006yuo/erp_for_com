/**
 * Created by Administrator on 2017/6/10.
 */
import {http} from '../lib/http-plus';

export const url_parcel_getOrder = "get|purchase-parcels/getPurchaseOrderInfoByTrackingNo";
export const api_parcel_getOrder = function (params) {
    return http(Url2(url_parcel_getOrder), params);
};

export const url_parcel_create ="post|purchase-parcels/createUpdateParcel";
export const api_parcel_create = function (params) {
    return http(Url2(url_parcel_create), params);
};

export const url_parcel_getTrackOrder ="get|purchase-parcels/getPurchaseOrderInfoByIds";
export const api_parcel_getTrackOrder = function (params) {
    return http(Url2(url_parcel_getTrackOrder), params, {
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};

export const url_parcel_delete = "post|purchase-parcels/deletePurchaseParcel";
export const api_parcel_delete = function (params) {
    return http(Url2(url_parcel_delete), params);
};

export const url_parcel_update ="post|purchase-parcels/updatePurchaseParcel";
export const api_parcel_update = function (params) {
    return http(Url2(url_parcel_update), params);
};

export const url_parcel_detail ="get|purchase-parcels/getPurchaseParcelDetail";
export const api_parcel_detail = function (params) {
    return http(Url2(url_parcel_detail), params);
};