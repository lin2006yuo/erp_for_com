/**
 * Created by user on 2017/3/16.
 */
import {http} from '../lib/http-plus';

//获取仓库
export const url_get_warehouse = "get|delivery/getWarehouseChannel";
export const api_get_warehouse = function(){
  return http(url_get_warehouse);
};
//为关联权限而设计的接口   shipping-method/trial/index
export const url_trial_index = "get|shipping-method/trial/index";
export const api_trial_index = function(){
    return http(url_trial_index);
};

//获取国家
export const url_get_country = "get|country";
export const api_get_country = function(){
  return http(url_get_country);
};

//获取运输方式
export const url_get_postway = "get|shipping-method/dictionary";
export const api_get_postway = function(data){
  return http(url_get_postway,data);
};

//获取列表
export const url_get_trial = "get|shipping-method/trial";
export const api_get_trial = function(data){
  return http(url_get_trial,data);
};
//获取物流属性
export const shipping_method_property = "get|shipping-method/Property";
export const api_shipping_method_property = function(data){
  return http(shipping_method_property,data);
};
