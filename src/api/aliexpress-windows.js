/**
 * Created by Administrator on 2017/7/7.
 */
import {http} from '../lib/http-plus';
//获取橱窗列表
export const url_windows_list = "get|aliexpress-windows-list";
export const api_windows_list = function (data) {
    return http(url_windows_list,data);
};

//获取列表销售员
export const url_aliexpress_sale_list = "get|orders/account";
export const api_aliexpress_sale_list = function() {
    return http(Url2(url_aliexpress_sale_list),{channel_id:4});
};

//获取橱窗详情
export const url_windows_detail = "get|aliexpress-windows-detail";
export const api_windows_detail = function(id) {
    return http(Url2(url_windows_detail),{id:id});
};

export const url_set_window_products = "post|setWindowProducts";
export const api_set_window_products = function (data) {
  return http(Url2(url_set_window_products),data)
}
