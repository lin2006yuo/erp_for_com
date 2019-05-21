import {http} from '../lib/http-plus';

export const url_amazon_refund = "get|amazon-refund";
export const api_amazon_refund = function(data) {
    return http(url_amazon_refund, data);
};

export const url_amazon_refund_fba = "get|amazon-refund/fba";
export const api_amazon_refund_fba = function(data) {
    return http(url_amazon_refund_fba, data);
};

export const url_amazon_refund_export = "post|amazon-refund/export";
export const api_amazon_refund_export = function(data) {
    return http(url_amazon_refund_export, data);
};

