import {http} from '../lib/http-plus';

//列表
export const url_get_shipping_price = "get|report/shipping-price";
export const api_get_shipping_price = function (data) {
    return http(url_get_shipping_price,data)
};