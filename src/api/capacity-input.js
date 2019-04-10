import {http} from '../lib/http-plus';

//扫描贴标信息
export const url_checkinfo = "get|purchase-parcels/label-statistics";
export const api_checkinfo = function (id) {
    return http(url_checkinfo, { id });
};
//提交扫描信息
export const url_postinfo = "post|purchase-parcels/label-statistics";
export const api_postinfo = function (data) {
    return http(url_postinfo, data);
};
export const url_get_operator= "get|user/warehouse/staffs";
export const api_operator = function () {
    return http(url_get_operator);
};
