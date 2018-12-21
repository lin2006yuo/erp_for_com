/**
 * Created by Administrator on 2018/6/5.
 */
import {http} from '../lib/http-plus';

// 获取选品刊登列表
export const url_wait_shopee_list = "get|publish/shopee/wait-upload";
export const api_wait_shopee_list = function (data) {
    return http(url_wait_shopee_list, data)
};

//pandao店铺分类树
export const url_mymall_category_tree = 'get|joom-category/category'; // joom
export const api_mymall_category_tree = function (data) {
    return http(url_mymall_category_tree, data);
};

// 获取在售listing列表
export const url_on_selling_list = "get|shopee-on-selling";
export const api_on_selling_list = function (data) {
    return http(url_on_selling_list, data)
};

//shopee获取销售员
export const url_get_shopee_sellers = "get|shopee-sellers";
export const api_get_shopee_sellers = function () {
    return http(url_get_shopee_sellers)
};

// 获取刊登记录列表
export const url_publish_record_list = "get|shopee-publish-record";
export const api_publish_record_list = function (data) {
    return http(url_publish_record_list, data)
};

// 编辑刊登记录
export const url_shopee_publish = 'get|shopee/:id/:status';
export const api_shopee_publish = function (id,status) {
    return http(Url2(url_shopee_publish, {id: id,status: status}))
}

// 提交刊登数据
export const url_record_publish = "get|shopee-publish-record";
export const api_record_publish = function (data) {
    return http(url_record_publish, data)
};

// 删除刊登记录列表
export  const  url_delete_shopee= 'delete|publish/shopee/delete';
export const api_delete_shopee = function (data) {
    return http(url_delete_shopee, data)
};

//获取刊登数据
export  const  url_shopee_getdata= 'get|publish/shopee/getdata';
export const api_shopee_getdata = function (data) {
    return http(url_shopee_getdata, data)
};
//获取账号
export  const  url_shopee_account = 'get|publish/shopee/accounts';
export const api_shopee_account = function (data) {
    return http(url_shopee_account, data)
};
//获取账号物流信息  publish/shopee/logistics
export  const  url_shopee_logistics = 'get|publish/shopee/logistics';
export const api_shopee_logistics = function (data) {
    return http(url_shopee_logistics, data)
};
//获取shopee分类
export  const  url_shopee_category = 'get|publish/shopee/category';
export const api_shopee_category = function (data) {
    return http(url_shopee_category, data)
};
//获取 shopee分类属性 publish/shopee/attribute
export  const  url_shopee_attribute = 'get|publish/shopee/attribute';
export const api_shopee_attribute = function (data) {
    return http(url_shopee_attribute, data)
};

//在售listing//批量修改可售量/价格/重量/物流方式/折扣
export  const  url_batch_setting = 'post|shopee-batch-setting';
export const api_batch_setting = function (data) {
    return http(url_batch_setting, data)
};
//在售listing 批量下架
export  const  url_batch_del_item = 'put|shopee/del-item/batch';
export const api_batch_del_item = function (data) {
    return http(url_batch_del_item, data)
};

//获取账号物流信息
export  const  url_logistics_shopee = 'get|publish/shopee/logistics';
export const api_logistics_shopee = function (data) {
    return http(url_logistics_shopee, data)
};

//获取折扣列表
export  const  url_shopee_discount = 'get|shopee-discount';
export const api_shopee_discount = function (data) {
    return http(url_shopee_discount, data)
};

//停售listing列表
export  const  url_stop_setting = 'get|shopee-stop-selling';
export const api_stop_setting = function (data) {
    return http(url_stop_setting, data)
};

//已售完listing列表
export  const  url_sold_out = 'get|shopee-sold-out';
export const api_sold_out = function (data) {
    return http(url_sold_out, data)
};

//删除
export  const  url_delete_publish_shopee = 'delete|publish/shopee/delete';
export const api_delete_publish_shopee = function (data) {
    return http(url_delete_publish_shopee, data)
};

//操作日志
export  const  url_logs_publish = 'get|publish/shopee/logs';
export const api_logs_publish = function (data) {
    return http(url_logs_publish, data)
};

//折扣编辑
export  const  url_discount_edit = 'get|shopee-discount-edit';
export const api_discount_edit = function (data) {
    return http(url_discount_edit, data)
};
//提交刊登数据
export  const  url_shopee_add = 'post|publish/shopee/add';
export const api_shopee_add = function (data) {
    return http(url_shopee_add, data)
};
//更新刊登数据
export  const  url_shopee_update = 'post|publish/shopee/update';
export const api_shopee_update = function (data) {
    return http(url_shopee_update, data);
};
//更新物流 shopee/:account_id/sync-logistics
export  const  url_sync_logistics = 'put|shopee/:account_id/sync-logistics';
export const api_sync_logistics = function (account_id) {
    return http(Url2(url_sync_logistics, {account_id:account_id}));
};
//获取仓库
export  const  url_local_warehouse = 'get|local-warehouse';
export const api_local_warehouse = function (account_id) {
    return http(url_local_warehouse);
};
