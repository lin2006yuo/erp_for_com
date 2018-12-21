import {http} from '../lib/http-plus';

//获取列表
export const get_heel_sale_complain_list = 'get|publish/amazon/heel-sale-complain';
export const api_heel_sale_complain_list = function(data){
    return http(get_heel_sale_complain_list, data);
};

//处理接口
export const get_heel_sale_complain_deal_with = 'post|publish/amazon/complain-status';
export const api_heel_sale_complain_deal_with = function(data){
    return http(get_heel_sale_complain_deal_with, data);
};

//AMAZON跟卖listing抓取
export const post_amazon_listing_grab = 'post|publish/amazon/heel-sale-get';
export const api_amazon_listing_grab = function(data){
    return http(post_amazon_listing_grab, data);
};

//删除
export const post_heel_sale_complain_delete = 'post|publish/amazon/complain-delete';
export const api_heel_sale_complain_delete = function(data){
    return http(post_heel_sale_complain_delete, data);
};