/**
 * Created by RondaFul on 2017/7/27.
 */
import {http} from '../lib/http-plus';

//获取收件箱的列表
export const url_get_ebay_emails ="get|ebay-emails";
export const api_get_ebay_emails = function(data) {
    return http(url_get_ebay_emails,data);
};
//获取账号
export const url_get_ebay_emails_account = "get|ebay-emails/account";
export const api_get_ebay_emails_account = function (data) {
    return http(url_get_ebay_emails_account,data)
};
//获取收件人
export const url_get_ebay_emails_receiver_mailAddr = "get|ebay-emails/receiver-mailAddr";
export const api_get_ebay_emails_receiver_mailAddr = function (data) {
    return http(url_get_ebay_emails_receiver_mailAddr,data)
};
//获取发件人
export const url_get_ebay_emails_send_mailAddr = "get|ebay-emails/send-mailAddr";
export const api_get_ebay_emails_send_mailAddr = function (data) {
    return http(url_get_ebay_emails_send_mailAddr,data)
};
//标记已读
export const url_put_ebay_emails_read = "put|ebay-emails/read";
export const api_put_ebay_emails_read = function (data) {
    return http(url_put_ebay_emails_read,data)
};
//标记未读
export const url_put_ebay_emails_unread = "put|ebay-emails/unread";
export const api_put_ebay_emails_unread = function (data) {
    return http(url_put_ebay_emails_unread,data)
};
//发送邮件(未启用)
export const url_post_ebay_emails_send= "post|ebay-emails/send";
export const api_post_ebay_emails_send= function (data) {
    return http(url_post_ebay_emails_send,data)
};
//标记垃圾邮件
export const url_put_ebay_emails_trash = "put|ebay-emails/trash";
export const api_put_ebay_emails_trash = function (data) {
    return http(url_put_ebay_emails_trash,data)
};
//回复或转发邮件
export const url_post_ebay_emails_reply = "post|ebay-emails/reply";
export const api_post_ebay_emails_reply = function (data) {
    return http(url_post_ebay_emails_reply,data)
};
//获取未读已读数量
export const url_post_ebay_emails_unread = "get|ebay-emails/unread";
export const api_post_ebay_emails_unread = function (data) {
    return http(url_post_ebay_emails_unread,data)
};
//置顶
export const url_put_ebay_emails_top = "put|ebay-emails/top";
export const api_put_ebay_emails_top = function (data) {
    return http(url_put_ebay_emails_top,data)
};
//取消置顶
export const url_put_ebay_emails_cancel_top = "put|ebay-emails/cancel-top";
export const api_put_ebay_emails_cancel_top = function (data) {
    return http(url_put_ebay_emails_cancel_top,data)
};