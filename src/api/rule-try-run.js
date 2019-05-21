import {http} from '../lib/http-plus';
export const url_get_list = 'post|orders/trial-rule';
export const api_get_list = function (data) {
    return http(url_get_list,data);
};
//rules/action
export const url_get_rules_action = 'get|rules/action';
export const api_get_rules_action = function () {
    return http(url_get_rules_action);
};