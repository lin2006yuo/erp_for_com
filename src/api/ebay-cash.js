import{http} from '../lib/http-plus';


/** ebay 店铺表格数据 */
export const url_ebay_cash = "get|ebay-settlement";
export const api_ebay_cash = function (data,header) {
    return http(url_ebay_cash, data,header);
};

/** paypal表格数据 */
export const paypal_cash = "get|ebay-settlement/paypal-statistics";
export const api_paypal_cash = function (data,header) {
    return http(paypal_cash, data,header);
};

/** ebay店铺数据导出  */
export const url_ebay_orders_exports = "get|ebay-settlement/shop-statistics-export";
export const api_ebay_export = function (data) {
    return http(url_ebay_orders_exports, data);
};

/** paypal店铺数据导出。 */
export const url_paypal_orders_exports = "get|ebay-settlement/paypal-statistics-export";
export const api_paypal_export = function (data) {
    return http(url_paypal_orders_exports, data);
};


/** 店铺paypal细节数据。 */
export const url_paypal_detail = "get|ebay-settlement/paypal-detail";
export const api_paypal_detail = function (data) {
    return http(url_paypal_detail, data);
};
