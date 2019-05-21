/**
 * Created by RondaFul on 2019/3/18.
 */
import {http} from '../lib/http-plus';
//列表接口
export const url_order_funmart_list = "get|funmart-orders";
export const api_order_funmart_list = function(data){
    return http(url_order_funmart_list,data);
};

//获取账号
export const url_get_accounts_list = "get|orders/accounts";
export const api_get_accounts_list = function (data) {
    return http(url_get_accounts_list,data);
};
