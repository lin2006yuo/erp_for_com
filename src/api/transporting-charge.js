import {http} from '../lib/http-plus';

//转运费列表
export const url_get_transfer_fee='get|transfer-fee';
export const api_get_transfer_fee=function(data){
  return http(url_get_transfer_fee,data);
};
//转运费添加
export const url_post_transfer_fee='post|transfer-fee';
export const api_post_transfer_fee=function(data){
  return http(url_post_transfer_fee,data);
};
//转运费修改状态
export const url_post_transfer_status='post|transfer-fee/status';
export const api_post_transfer_status=function(data){
  return http(url_post_transfer_status,data);
};
//转运费历史记录
export const url_get_transfer_fee_history='get|transfer-fee/history';
export const api_get_transfer_fee_history=function(data){
  return http(url_get_transfer_fee_history,data);
};
//获取币种列表
export const url_get_currency_select_list = "get|currency";
export const api_get_currency_select_list = function(){
    return http(url_get_currency_select_list);
};
//发货仓库列表
export const url_get_warehouse = "get|warehouse";
export const api_get_warehouse = function(data){
    return http(url_get_warehouse,data);
};
//物流商列表
export const url_get_carrier = "get|carrier";
export const api_get_carrier = function(data){
    return http(url_get_carrier,data);
};
