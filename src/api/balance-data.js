import {http} from '@/lib/http-plus';

//首页余额列表
export const url_balance_list = 'get|amazon-account-health/balance';
export const api_balance_list = function(data){
    return http(url_balance_list,data)
};
//首页余额详情
export const url_balance_details = 'get|amazon-account-health/balance-details';
export const api_balance_details = function(data){
    return http(url_balance_details,data)
};
