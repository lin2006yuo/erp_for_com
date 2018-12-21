/**
 * Created by Administrator on 2018/8/27.
 */
import {http} from '../lib/http-plus';

//获取列表数据
export const url_get_message = "get|report/customer-message";
export const api_get_message = function (data) {
    return http(url_get_message,data);
};

//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};

//客服人员
export const url_get_member = "get|member-ship/customer/member";
export const api_get_member = function (data) {
    return http(url_get_member,data);
};

//导出
export const url_get_export = "post|report/customer-message/export";
export const api_get_export = function (data) {
    return http(url_get_export,data);
};