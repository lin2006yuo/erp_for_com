/**
 * Created by RondaFul on 2017/3/21.
 */
import {http} from '../lib/http-plus';

//获取收件箱的列表
export const url_inner_list = "get|ebay-message";
export const api_inner_list = function(data){
  return http(url_inner_list, data);
};

//获取优先级字典
export const url_message_level = "get|ebay-message/level";
export const api_message_level = function(){
  return http(url_message_level);
};

//获取优先级消息数量
export const url_message_countlevel = "get|ebay-message/getLevelCount";
export const api_message_countlevel = function(){
  return http(url_message_countlevel);
};

//查看ebay详细消息
export const url_ebay_message_detail = "get|ebay-message/:id";
export const api_ebay_message_detail = function(id){
  return http(Url2(url_ebay_message_detail,{id:id}));
};

//删除站内信
export const url_ebay_message_deL = "delete|ebay-message/:id";
export const api_ebay_message_del = function(id){
  return http(Url2(url_ebay_message_deL,{id:id}));
};

//获取客服信息
export const url_message_customer = "get|member-ship/customer/member";
export const api_message_customer = function(){
  return http(url_message_customer,{channel_id:1});
};

//  修改站内信等级
export const url_message_change_level = "post|ebay-message/updateMessageLevel";
export const api_message_change_level = function(data){
  return http(url_message_change_level, data);
};

//回复
export const url_message_replay = "post|ebay-message/replay"
export const api_message_replay = function(data){
  return http(url_message_replay, data, {
      contentType:'application/x-www-form-urlencoded',
      timeout:120000
  });
};

//忽略
export const url_message_ignore = "post|ebay-message/status";
export const api_message_ignore = function(data){
  return http(url_message_ignore, data);
};

//获取列表信息
export const url_message_table_list = "get|ebay-message/getOrderList"
export const api_message_table_list = function(data){
  return http(url_message_table_list, data);
};

//获取ebay来信
export const url_ebay_list = "get|ebay-message/getMessageList";
export const api_ebay_list = function(data){
  return http(url_ebay_list, data);
};

//获取收件箱列表
export const url_out_list = "get|ebay-message/getMessageList";
export const api_out_list = function(data){
  return http(url_out_list, data);
};

//重新发送
export const url_message_resend = "post|ebay-message/resend";
export const api_message_resend = function(data){
  return http(url_message_resend, data);
};

//获取回复模板列表
export const url_all_templates = "get|msg-tpl/getTemplates";
export const api_all_templates = function(data){
  return http(url_all_templates, data);
};

//获取回复模板内容
export const url_templates_content = "get|msg-tpl/content";
export const api_templates_content = function(data){
  return http(url_templates_content, data);
};

//通过分组信息获取消息列表
export const url_ebay_message_all_detail = "get|ebay-message/getGroupDatas";
export const api_ebay_message_all_detail = function(data){
  return http(url_ebay_message_all_detail, data);
};

//账号简称
export const url_ebay_message_accout = "get|orders/account";
export const api_ebay_message_accout = function(data){
  return http(url_ebay_message_accout, data);
};
//批量重新发送
export const url_message_resend_batch = "post|ebay-message/resend/batch";
export const api_message_resend_batch = function(data){
    return http(url_message_resend_batch, data);
};
//加载更多数据
export const url_message_more= "get|ebay-message/list";
export const api_message_more = function(data){
    return http(url_message_more, data);
};
//获取账号信息
export const url_message_account= "get|ebay-message/account";
export const api_message_account = function(data){
    return http(url_message_account, data);
};
//根据单号获取邮箱账号
export const url_message_setting_buyer='get|ebay-emails/getBuyerInfo';
export const api_message_setting_buyer = function(data){
    return http(url_message_setting_buyer, data);
};
//根据账号获取客服
export const url_message_setting_customer='get|ebay-emails/account/customers';
export const api_message_setting_customer = function(data){
    return http(url_message_setting_customer, data);
};
// 发送 邮件
export const url_message_setting_send='post|ebay-emails/send';
export const api_message_setting_send = function(data){
    return http(url_message_setting_send, data);
};
//标记邮件问题类型 /
export const url_put_ebay_emails_id='put|ebay-message/:id';
export const api_put_ebay_emails_id = function(id,data){
    return http(Url2(url_put_ebay_emails_id,{id:id}),data);
};
//添加备注信息
export const url_post_ebay_message_remark= "post|ebay-message/remark";
export const api_post_ebay_message_remark = function(data){
    return http(url_post_ebay_message_remark, data);
};
