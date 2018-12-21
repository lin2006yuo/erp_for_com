import {http} from '../lib/http-plus';
export const url_ymx_exists = 'post|amazon-orders/exists';
export const api_ymx_exists = function (data) {
    return http(url_ymx_exists,data)
};
export const url_ebay_exists = 'post|ebay-orders/exists';
export const api_ebay_exists = function (data) {
    return http(url_ebay_exists,data)
};
export const url_joom_exists = 'post|joom-orders/check';
export const api_joom_exists = function (data) {
    return http(url_joom_exists,data)
};
export const url_walmart_exists = 'post|walmart-orders/check';
export const api_walmart_exists = function (data) {
    return http(url_walmart_exists,data)
};
export const url_pandao_exists = 'post|pandao-orders/check';
export const api_pandao_exists = function (data) {
    return http(url_pandao_exists,data)
};
export const url_paytm_exists = 'post|paytm-orders/check';
export const api_paytm_exists = function (data) {
    return http(url_paytm_exists,data)
};
export const url_wish_exists = 'post|wish-orders/check';
export const api_wish_exists = function (data) {
    return http(url_wish_exists,data)
};
export const url_aliexpress_exists = 'post|aliexpress-order/exists';
export const api_aliexpress_exists = function (data) {
    return http(url_aliexpress_exists,data)
};
export const url_lazada_exists = 'post|lazada-orders/check';
export const api_alazada_exists = function (data) {
    return http(url_lazada_exists,data)
};
export const url_shopee_exists = 'post|shopee-order/check-order-sn';
export const api_shopee_exists = function (data) {
    return http(url_shopee_exists,data)
};