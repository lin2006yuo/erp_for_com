/**
 * Created by RondaFul on 2017/3/17.
 */
import {http} from '../lib/http-plus';

//获取收件箱的列表
export const url_ebay_inner_list = "get|ebay-message"
export const api_ebay_inner_list = function(data){
  return http(url_ebay_inner_list,data)
};
//获取ebay来信列表
export const url_ebay_message_list = "get|ebay-message/platformMessage"
export const api_ebay_message_list = function(data){
  return http(url_ebay_message_list,data)
};

//查看ebay详细消息
export const url_ebay_message_detail = "get|ebay-message/:id"
export const api_ebay_message_list = function(id){
  return http(Url2(url_ebay_message_detail,{id:id}))
};
