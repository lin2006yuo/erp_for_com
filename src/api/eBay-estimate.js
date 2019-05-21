/**
 * Created by RondaFul on 2017/4/18.
 */

import {http} from '../lib/http-plus';
//获取客服账号
export const url_get_customer = "get|member-ship/customer/member?channel_id=1"
export const api_get_customer = function(){
  return http(url_get_customer)
};
//获取评价列表
export const url_get_list = "get|ebay-feedback"
export const api_get_list = function(data){
  return http(url_get_list,data)
};
//查看
export const url_ebay_check = "get|ebay-feedback/:id"
export const api_ebay_check = function(id){
  return http(Url2(url_ebay_check,{id:id}))
};
//编辑-评价/回评/追评页面
export const url_ebay_edit = "get|ebay-feedback/:id/edit"
export const api_ebay_edit = function(id){
  return http(Url2(url_ebay_edit,{id:id}))
};
//获取评价模板
export const url_getTemplates = "get|msg-tpl/getTemplates"
export const api_getTemplates = function(data){
  return http(url_getTemplates,data)
};
//获取评价模板内容
export const url_getTemplate_content = "get|/msg-tpl/content"
export const api_getTemplate_content = function(data){
  return http(url_getTemplate_content,data)
};
//获取评价模板内容
export const url_tplContent = "get|ebay-feedback/tplContent"
export const api_tplContent = function(data){
  return http(url_tplContent,data)
};
//追评
export const url_respond = "post|ebay-feedback/respond"
export const api_respond = function(data){
  return http(url_respond,data)
};
//批量回评
export const url_batch_comment = "post|ebay-feedback/batch/comment"
export const api_batch_comment = function(data){
  return http(url_batch_comment,data)
};
//跟进
export const url_sendMsg = "post|ebay-feedback/sendMsg"
export const api_sendMsg = function(data){
  return http(url_sendMsg,data,{
        contentType:'application/x-www-form-urlencoded',
            timeout:120000
    })
};
//处理
export const url_status = "post|ebay-feedback/status"
export const api_status = function(data){
  return http(url_status,data)
};
//回评状态
export const url_statusStatistics = "get|ebay-feedback/statusStatistics"
export const api_statusStatistics = function(){
  return http(url_statusStatistics)
};
//单个回评
export const url_comment = "post|ebay-feedback/comment"
export const api_comment = function(data){
  return http(url_comment,data)
};
//重新回评
export const url_repeat = "post|ebay-feedback/repeat"
export const api_repeat = function(data){
  return http(url_repeat,data)
};
//回复评价
export const url_reply = "post|ebay-feedback/reply"
export const api_reply = function(data){
    return http(url_reply,data)
};
