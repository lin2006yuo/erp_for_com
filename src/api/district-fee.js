// http://172.18.8.242//country-area/cityList?country_code=CN&page=1&pageSize

import {http} from '../lib/http-plus';

//获取收件箱的列表
export const url_city = "get|country-area/cityList"
export const api_city = function(data){
  return http(url_city,data)
};