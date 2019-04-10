import{http} from '../lib/http-plus';


//列表
export const ebay_cash = "post|ebay-orders/shop-statistics";
export const api_ebay_cash = function (data) {
    return http(ebay_cash, data);
};


export const paypal_cash = "post|ebay-orders/paypal-statistics";
export const api_paypal_cash = function (data) {
    return http(paypal_cash, data);
};

export const url_ebay_orders_exports = "post|ebay-orders/statistics-export";
export const api_ebay_export = function (data) {
    return http(url_ebay_orders_exports, data);
};

export const url_paypal_orders_exports = "post|paypal-orders/statistics-export";
export const api_paypal_export = function (data) {
    return http(url_paypal_orders_exports, data);
};