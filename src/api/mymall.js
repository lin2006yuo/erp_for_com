/**
 * Created by RondaFul on 2018/04/28.
 */
import {http} from '../lib/http-plus';


// 获取mymall账号列表
export const url_get_account = "get|pandao-account";
export const api_get_account = function () {
    return http(url_get_account)
};

//获取销售员
export const url_get_sellers = "get|pandao-sellers";
export const api_get_sellers = function () {
    return http(url_get_sellers)
};
// 获取选品刊登商品列表
export const url_wait_publish_list = "get|publish/pandao/wait-upload";
export const api_wait_publish_list = function (data) {
    return http(url_wait_publish_list, data)
};

// 获取刊登记录商品列表
export const url_record_publish_list = "get|pandao-publish-record";
export const api_record_publish_list = function (data) {
    return http(url_record_publish_list, data)
};

//获取停售列表
export const url_publish_sold_out = "get|pandao-sold-out";
export const api_publish_sold_out = function (data) {
    return http(url_publish_sold_out, data)
};
//获取在售列表
export const url_publish_on_sale = "get|pandao-on-selling";
export const api_publish_on_sale = function (data) {
    return http(url_publish_on_sale, data)
};

//pandao店铺分类树
export const url_mymall_category_tree = 'get|joom-category/category'; // joom
export const api_mymall_category_tree = function (data) {
    return http(url_mymall_category_tree, data);
};
//删除

export const url_record_del = "delete|publish/pandao/delete";
export const api_record_del = function (data) {
    return http(url_record_del, data)
};
// 提交刊登
export const url_record_publish = "post|publish/pandao/push-queue";
export const api_record_publish = function (data) {
    return http(url_record_publish, data)
};
//同步listing
export const url_record_Synchronize = "post|publish/pandao/rsync-product";
export const api_record_Synchronize = function (data) {
    return http(url_record_Synchronize, data)
};
//批量下架
export const url_record_drop= "post|publish/pandao/batch-disable";
export const api_record_drop = function (data) {
    return http(url_record_drop, data)
};
//批量上架
export const url_record_up= "post|publish/pandao/batch-enable";
export const api_record_up = function (data) {
    return http(url_record_up, data)
};
//操作日志
export const url_record_logs= "get|publish/pandao/logs";
export const api_record_logs = function (data) {
    return http(url_record_logs, data)
}


