import {http} from '../lib/http-plus';

//获取列表
export const get_heel_sale_list = 'get|publish/amazon/heel-sale-list';
export const api_heel_sale_list = function(data){
    return http(get_heel_sale_list, data);
};

//批量添加跟卖
export const url_post_heel_sale = 'post|publish/amazon/batch-heel-sale';
export const api_post_heel_sale = function(data){
    return http(url_post_heel_sale, data);
};