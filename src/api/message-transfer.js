/**
 * Created by user on 2018/8/23.
 * 更换api传参方式  Alison  2018/8/23
 */
import {http} from '../lib/http-plus';

//Ebay待处理列表
export const url_message_list = "get|message-transfer";
export const api_message_list = function (data) {
    return http(url_message_list,data);
}
//Ebay待处理列表相关参数级数量
export const url_message_total = "get|message-transfer/account-total";
export const api_message_total = function (data) {
    return http(url_message_total,data);
}
//获取客服
export const url_message_customer = "get|member-ship/customer/member"
export const api_message_customer = function(data){
    return http(url_message_customer,data);
};
//Ebay待处理数据转发
export const url_message_transfer = "post|message-transfer/transfer";
export const api_message_transfer = function (data) {
    return http(url_message_transfer,data);
}
