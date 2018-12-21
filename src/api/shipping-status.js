/**
 * Created by alison on 16-11-28.
 */
import {http} from '../lib/http-plus';

export const url_synchronize_list='get|synchronizes';
export const api_synchronize_list=function(data){
  return http(Url2(url_synchronize_list),data);
}
export const url_shipping ='get|synchronizes/shipping';
export  const api_shipping = function (data) {
  return http(Url2(url_shipping),data)
}

export const url_surplus ='get|synchronizes/surplus';
export  const api_surplus = function (data) {
  return http(Url2(url_surplus),data)
}


export const url_status ='get|synchronizes/:type/status';
export  const api_order_status = function (data) {
  return http(Url2(url_status,{type:'order'}),data,{
      contentType:'application/x-www-form-urlencoded',
      timeout:120000
  })
}

export  const api_synchronize_status = function (data) {
  return http(Url2(url_status,{type:'synchronize'}),data)
}

export const url_get_country = 'get|country';
export const api_get_country = function (data) {
    return http(Url2(url_get_country),data);
}

export const url_syn_start = 'post|synchronizes/start';
export const api_syn_start = function (data) {
    return http(Url2(url_syn_start),data);
}


export const url_overlook =  'post|synchronizes/ignore';
export const api_overlook = function (data) {
  return http(Url2(url_overlook),data);
}

export const url_history = 'get|synchronizes/history';
export const api_history = function (data) {
  return http(Url2(url_history),data)
};

export const url_get_warehouse = "get|orders/warehouse/info";
export const api_get_warehouse = function(){
    return http(Url2(url_get_warehouse));
};
