/**
 * Created by Administrator on 2017/7/14.
 */
import {http} from '../lib/http-plus';

export const url_wish_health = "get|wish-health-data-list";
export const api_wish_health = function (data) {
  return http(Url2(url_wish_health),data);
};

export const url_wish_history_health_data = "get|wish-history-health-data";
export const api_wish_history_health_data = function (data) {
  return http(Url2(url_wish_history_health_data),data)
};

export const url_wish_shop_auth = "post|wish-shop-auth";
export const api_wish_shop_auth = function (data) {
  return http(Url2(url_wish_shop_auth), data)
};

export const url_mobile_code = "post|get-wish-mobile-code";
export const api_mobile_code = function (data) {
    return http(Url2(url_mobile_code) ,data)
};

export const url_wish_shop_monitor = "post|wish-shop-monitor";
export const api_wish_shop_monitor = function (data) {
    return http(Url2(url_wish_shop_monitor), data);
};

export const url_get_monitor_data = "get|get-monitor-data";
export const api_get_monitor_data = function (data) {
    return http(Url2(url_get_monitor_data), data);
};
