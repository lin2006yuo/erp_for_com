/**
 * Created by user on 2016/12/22.
 */
import {http} from '../lib/http-plus';
export const url_product_list = "get|goodsdev"
export const api_product_list = function(data){
  return http(url_product_list, data);
};
