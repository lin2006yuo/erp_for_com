/**
 * Created by Administrator on 2017/11/8.
 */
import {http} from '../lib/http-plus';

export const url_get_channels = "get|make-pickings/channels";
export const api_get_channels = function(data){
    return http(url_get_channels,data)
};

export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function(){
    return http(url_entrepot_picking)
};

export const url_get_accounts = "get|delivery/accounts";
export const api_get_accounts = function(data){
    return http(url_get_accounts,data)
};

//运算符
export const url_get_operator = "get|make-pickings/operator";
export const api_get_operator = function(data){
    return http(url_get_operator,data)
};

//拣货单列表
export const url_get_pickings = "get|make-pickings";
export const api_get_pickings = function(data){
    return http(url_get_pickings,data)
};

//分区
export const url_get_area = "get|warehouse-area/lists";
export const api_get_area = function(data){
    return http(Url2(url_get_area), data);
};

//剩余时间
export const url_get_surplus = "get|make-pickings/surplus";
export const api_get_surplus = function(id){
    return http(Url2(url_get_surplus, {id:id}));
};

//国家
export const url_get_country = "get|country";
export const api_get_country = function(data){
    return http(Url2(url_get_country), data);
};

//运输方式
export const url_get_shipping = "get|make-pickings/shipping";
export const api_get_shipping = function(data){
    return http(Url2(url_get_shipping), data);
};

//生成拣货单
export const url_post_pickings = "post|make-pickings";
export const api_post_pickings = function(data){
    return http(url_post_pickings,data)
};

//获取包裹类型
export const url_get_packages = "get|packages/type";
export const api_get_packages = function(data){
    return http(url_get_packages,data)
};
//获取播种车列表
export const url_get_shelf = "get|sorting-shelf/lists";
export const api_get_shelf = function(data){
    return http(url_get_shelf, data)
};

