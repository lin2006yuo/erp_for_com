/**
 * Created by alison on 16-12-6.
 */
import {http} from '../lib/http-plus';

export const url_stockrecord = "get|stock"
export const api_get = function(data){
  return http(url_stockrecord, data);
};

export const url_config_data = "get|stock/getWarehouseStockStatus"
export const api_config_data= function(){
  return http(url_config_data);
};

export const url_delete = "delete|stock/:id"
export const api_delete = function(id){
  return http(Url2(url_delete,{id:id}));
};

export const url_look_up = "delete|stock/:id"
export const api_look_up = function(id){
  return http(Url2(url_look_up,{id:id}));
};
