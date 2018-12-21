import {http} from '../lib/http-plus';

//paypal纠纷列表
export const url_get_paypal_dispute = "get|paypal-dispute";
export const api_get_paypal_dispute = function (data) {
    return http(url_get_paypal_dispute,data)
};

//paypal纠纷状态
export const url_get_paypal_status = "get|paypal-dispute/statistics";
export const api_get_paypal_status = function (data) {
    return http(url_get_paypal_status,data)
};

//paypal纠纷更新
export const url_paypal_dispute_update = "put|paypal-dispute/:id";
export const api__paypal_dispute_update = function (id,data) {
    return http(Url2(url_paypal_dispute_update,{id:id}),data)
};

//paypal纠纷账号筛选
export const url_get_paypal_account = "get|paypal-dispute/accounts";
export const api_get_paypal_account = function (data) {
    return http(url_get_paypal_account,data)
};

//paypal纠纷详情
export const url_paypal_dispute_details = "get|paypal-dispute/:id";
export const api_paypal_dispute_details = function (id,data) {
    return http(Url2(url_paypal_dispute_details,{id:id}),data)
};