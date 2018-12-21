/**
 * Created by RondaFul on 2017/7/27.
 */
import {http} from '../lib/http-plus';

//获取收件箱的列表
export const url_amazon_list = "get|amazon-emails";
export const api_amazon_list = function(data){
    return http(url_amazon_list, data);
};
//发送邮件列表
export const url_amazon_send_list = "get|amazon-emails/sent-emails";
export const api_amazon_send_list = function(data){
    return http(url_amazon_send_list, data);
};
//获取客户历史邮件

export const url_amazon_old_email = "get|amazon-emails/senders/:email_address";
export const api_amazon_old_email = function(id,data){
    return http(Url2(url_amazon_old_email,{email_address:id}),data);
};


//邮件更改状态
export const url_amazon_change_mark = "put|amazon-emails/:id";
export const api_amazon_change_mark = function(id,data){
    return http(Url2(url_amazon_change_mark,{id:id}),data);
};
//获取客服
export const url_customer ="get|member-ship/customer/member?channel_id=2";
export const api_customer = function() {
    return http(Url2(url_customer));
};
//获取账号
export const url_get_account = "get|orders/account";
export const api_get_account = function (data) {
    return http(Url2(url_get_account),data)
}
//获取amazon账号
export const url_get_amazon_message_account = "get|amazon-message/account";
export const api_get_amazon_message_account = function () {
    return http(url_get_amazon_message_account)
}
//获取table内容
export const url_get_table = "get|orders/buyer-amazon-orders/:buyer_id";
export const api_get_table = function (buyer_id) {
    return http(Url2(url_get_table,{buyer_id}))
}
//回复
export const url_amazon_reply = "post|amazon-emails/reply-emails";
export const api_amazon_reply = function(data){
    return http(url_amazon_reply, data);
};
//已读
export const url_amazon_read = "post|amazon-emails/read";
export const api_amazon_read = function(data){
    return http(url_amazon_read, data);
};
//写邮件
export const url_amazon_write = "post|amazon-emails/sent-emails/send";
export const api_amazon_write = function(data){
    return http(url_amazon_write, data);
};
//加载信息
export const url_amazon_writ_load = "get|orders/:order_number_type/:order_number/buyer-info";
export const api_amazon_writ_load = function(type,number){
    return http(Url2(url_amazon_writ_load,{order_number_type:type,order_number:number}));
};

//写邮件 客服列表
export const url_amazon_write_customer = "get|amazon-emails/account/customers";
export const api_amazon_write_customer = function(data){
    return http(url_amazon_write_customer, data);
};
//重新发送
export const url_amazon_resend = "post|amazon-emails/sent-mails/resend/:mail_id";
export const api_amazon_resend= function(id){
    return http(Url2(url_amazon_resend,{mail_id:id}));
};
//邮件设置
//亚马逊账号列表接口
export const url_amazon_email_account_list= "get|email-account";
export const api_amazon_email_account_list = function(data){
    return http(url_amazon_email_account_list,data);
};
//添加亚马逊邮箱账号接口
export const url_amazon_email_account_add= "post|email-account";
export const api_amazon_email_account_add = function(data){
    return http(Url2(url_amazon_email_account_add),data);
};
//查看接口
export const url_amazon_email_account_look= "get|email-account/:id";
export const api_amazon_email_account_look = function(id){
    return http(Url2(url_amazon_email_account_look,{id:id}));
};
//修改
export const url_amazon_email_account_mdf= "put|email-account/:email_account_id";
export const api_amazon_email_account_mdf = function(id,data){
    return http(Url2(url_amazon_email_account_mdf,{email_account_id:id}),data);
};
//状态
export const url_amazon_email_account_status= "put|email-account/:email_account_id/enabled";
export const api_amazon_email_account_status = function(id,data){
    return http(Url2(url_amazon_email_account_status,{email_account_id:id}),data);
};
//删除
export const url_amazon_email_account_del= "delete|email-account";
export const api_amazon_email_account_del = function(data){
    return http(url_amazon_email_account_del,data);
};
//操作日志
export const url_amazon_email_account_log= "get|amazon-emails/email-account/log/:email_account_id";
export const api_amazon_email_account_log = function(id){
    return http(Url2(url_amazon_email_account_log,{email_account_id:id}));
};
//收取指定平台账号的邮件接口
export const url_amazon_email_account_assign= "get|amazon-emails/email-account/receive/:account_id";
export const api_amazon_email_account_assign = function(id){
    return http(Url2(url_amazon_email_account_assign,{account_id:id}));
};

//取消系统订单接口
export const url_cancel_order= "post|orders/cancel-order";
export const api_cancel_order = function(data){
    return http(url_cancel_order,data);
};
//获取站点
export const url_amazon_emails_site= "get|amazon-emails/site";
export const api_amazon_emails_site = function(){
    return http(url_amazon_emails_site);
};

//写邮件  获取所有可发送邮件的账号
export const url_get_email_account ="get|amazon-emails/amazon-emailAccount";
export const api_get_email_account = function(data) {
    return http(url_get_email_account,data);
};