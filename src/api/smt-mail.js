/**
 * Created by RondaFul on 2017/3/31.
 */
import {http} from '../lib/http-plus';

//获取站内信标签统计
export const url_levelStatistics ="get|aliexpress-msg/rankStatistics";
export const api_levelStatistics = function(data) {
    return http(url_levelStatistics,data);
};
//获取客服人员
export const url_customer ="get|member-ship/customer/member?channel_id=4";
export const api_customer = function() {
    return http(Url2(url_customer));
};
//站内信列表
export const url_smt_list ="get|aliexpress-msg";
export const api_smt_list = function(data) {
    return http(Url2(url_smt_list),data);
};
//站内信标签
export const url_level ="get|aliexpress-msg/rank";
export const api_level = function() {
    return http(Url2(url_level));
};
//站内信关联订单
export const url_orders ="get|aliexpress-msg/:id/orders";
export const api_orders = function(id) {
    return http(Url2(url_orders,{id:id}));
};
//处理优先级
export const url_changelevel ="post|aliexpress-msg/:channel_id/changeRank/:rank";
export const api_changelevel = function(channel_id,rank){
    return http(Url2(url_changelevel,{channel_id:channel_id,rank:rank}));
};
//单条消息详细
export const url_detail ="get|aliexpress-msg/:id/detail";
export const api_detail = function(id){
    return http(Url2(url_detail,{id:id}));
};
//回复站内信
export const url_replay ="post|aliexpress-msg/replay";
export const api_replay = function(data) {
    return http(Url2(url_replay),data);
};
//更改站内信是否已读
export const url_read ="post|aliexpress-msg/:id/readMsg";
export const api_read = function(id) {
    return http(Url2(url_read,{id:id}));
};
//忽略
export const url_batchProcessed ="post|aliexpress-msg/batchProcessed";
export const api_batchProcessed = function(data) {
    return http(Url2(url_batchProcessed),data);
};
//模板
export const url_tmpContent ="get|aliexpress-msg/tmpContent";
export const api_tmpContent = function(data) {
    return http(Url2(url_tmpContent),data);
};
/*----------------------发件箱*/
//列表
export const url_outbox_list ="get|ali-outbox";
export const api_outbox_list = function(data) {
    return http(Url2(url_outbox_list),data);
};
//明细
export const url_outbox_detail ="get|ali-outbox/:id";
export const api_outbox_detail = function(id){
    return http(Url2(url_outbox_detail,{id:id}));
};
//重发
export const url_outbox_resend ="post|ali-outbox/:id/resend";
export const api_outbox_resend = function(id){
    return http(Url2(url_outbox_resend,{id:id}));
};
//删除
export const url_outbox_del ="delete|ali-outbox/:id";
export const api_outbox_del = function(id){
    return http(Url2(url_outbox_del,{id:id}));
};

//回复
export const url_reply = "post|aliexpress-msg";
export const api_reply = function (data) {
  return http(Url2(url_reply),data)
};

export const url_ebay_send = "post|ebay-message/send";
export const api_ebay_send = function (data) {
  return http(url_ebay_send, data,{
      contentType:'application/x-www-form-urlencoded',
      timeout:120000
  })
};

export const url_template_groups ="get|msg-tpl-group";
export const api_template_groups = function (data) {
    return http(Url2(url_template_groups),data);
};

export const url_templates = "get|msg-tpl/getTemplates";
export const api_templates = function (data) {
  return http(Url2(url_templates),data);
};

export const url_aliexpress_msg = "get|aliexpress-msg/temp-detail-order";
export const api_aliexpress_msg = function (data) {
  return http(Url2(url_aliexpress_msg),data)
};

export const url_msg_tpl_content = "get|msg-tpl/content";
export const api_msg_tpl_content = function (data) {
  return http(Url2(url_msg_tpl_content), data);
};

export const url_post_tpl_content = "post|ebay-feedback/comment";
export const api_post_tpl_content = function (data) {
    return http(Url2(url_post_tpl_content), data);
};


//----------------------------------------------
// export const url_outbox_emotions = '//localhost:8881/emotions';
// export const api_outbox_emotions = function(data) {
//     return http('GET',url_outbox_emotions,data);
// };

export const url_outbox_emotions = 'get|emotions';
export const api_outbox_emotions = function(data) {
  return http(Url2(url_outbox_emotions),data);
};

//站内信细明
export const url_aliexpress_msg_list ="get|aliexpress-msg/:id";
export const api_aliexpress_msg_list = function(id){
  return http(Url2(url_aliexpress_msg_list,{id:id}));
};
//邮件--展开更多消息
export const url_aliexpress_msg_more ="get|aliexpress-msg/more-msg";
export const api_aliexpress_msg_more = function(data){
  return http(url_aliexpress_msg_more,data);
};
//速卖通订单延长收货时间
export const url_aliexpress_order_times ="put|aliexpress-order/times";
export const api_aliexpress_order_times = function(data){
  return http(url_aliexpress_order_times,data);
};
//同步速卖通站内信
export const url_post_aliexpress_msg_sync = "post|aliexpress-msg/sync";
export const api_post_aliexpress_msg_sync = function (data) {
    return http(Url2(url_post_aliexpress_msg_sync), data);
};
//获取button账号
export const url_get_ali_express_msg_account = "get|aliexpress-msg/account";
export const api_get_ali_express_msg_account = function () {
    return http(Url2(url_get_ali_express_msg_account));
}

