/**
 * Created by wuchuguang on 16-11-25.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';


export const url_get_warehouse = "get|orders/:type/info";
export const api_get_warehouse = function(){
    return http(Url2(url_get_warehouse,{type:'warehouse'}));
};

export const url_get_shipping = "get|shipping-method/list-order";
export const api_get_shipping = function(data){
    return http(url_get_shipping,data);
};
export const url_search_warehouse = "get|warehouse/search";
export const api_search_warehouse = function (search) {
    return http(url_get_shipping ,search);
};
export const url_account_search = "get|channel-account/search";
export const api_account_search = function (channel, search) {
    return http(url_account_search,{channel:channel,keyword:search});
};
//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};
//获取站点 或 账号
export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};
//获取包裹的分配库存状态
export const url_distribution_type_info = "get|packages/distribution-type/info";
export const api_distribution_type_info = function(){
    return http(url_distribution_type_info);
};
//获取包裹的生成拣货单状态
export const url_picking_type_info = "get|packages/picking-type/info";
export const api_picking_type_info = function(){
    return http(url_picking_type_info);
};
//获取包裹的包装状态
export const url_packing_type_info = "get|packages/packing-type/info";
export const api_packing_type_info = function(){
    return http(url_packing_type_info);
};