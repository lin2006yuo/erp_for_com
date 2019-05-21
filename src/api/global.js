/**
 * Created by wuchuguang on 17-4-26.
 */
import {http} from '../lib/http-plus';

export const url_channels = "get|global/channels";
export const api_channels = function(){
  return http(url_channels)
};

export const url_warehouses = "get|global/warehouse";
export const api_warehouses = function(){
  return http(url_warehouses)
};
//获取平台
export const url_get_channel_categories ="get|orders/channel";
export const api_get_channel_categories = function () {
    return http(Url2(url_get_channel_categories), {});
};
export const url_channel_accounts = "get|global/channel-accounts";
export const api_channel_accounts = function(data){
  return http(url_channel_accounts,data)
};
