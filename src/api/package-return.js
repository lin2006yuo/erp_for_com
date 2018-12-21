/**
 * Created by Administrator on 2017/11/28.
 */
import {http} from '../lib/http-plus';
export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function(){
    return http(url_entrepot_picking)
};
//获取原因列表
export const url_get_reason = "get|package-return/reason";
export const api_get_reason = function(data){
    return http(url_get_reason, data)
};

//获取状态列表
export const url_get_status = "get|package-return/status";
export const api_get_status = function(){
    return http(url_get_status)
};

//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};

export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};

//获取退回包裹信息列表
export const url_get_return = "get|package-return";
export const api_get_return = function(data){
    return http(url_get_return, data)
};

//标记为待重发
export const url_post_waitreissued = "post|package-return/:id/wait-for-reissued";
export const api_post_waitreissued = function(id, data){
    return http(Url2(url_post_waitreissued, {id:id}), data)
};

//标记为已重发
export const url_post_alreadyreissued = "post|package-return/:id/already-reissued";
export const api_post_alreadyreissued = function(id, data){
    return http(Url2(url_post_alreadyreissued, {id:id}), data)
};

//入库
export const url_post_alreadystorage = "post|package-return/:id/storage";
export const api_post_alreadystorage = function(id,data){
    return http(Url2(url_post_alreadystorage, {id:id}), data)
};

//查看信息
export const url_get_storageinfo = "get|package-return/:id/storage-info";
export const api_get_storageinfo = function(id,data){
    return http(Url2(url_get_storageinfo, {id:id}), data)
};

//标记待入库
export const url_post_waitstorage = "post|package-return/:id/wait-for-storage";
export const api_post_waitstorage = function(id,data){
    return http(Url2(url_post_waitstorage, {id:id}), data)
};

//录入包裹
export const url_post_package = "post|package-return/handle";
export const api_post_package = function(data){
    return http(Url2(url_post_package), data)
};

//打印面单
export const url_get_returnpackage = "get|package-return/:id/print";
export const api_get_returnpackage = function(id){
    return http(Url2(url_get_returnpackage, {id:id}))
};

//查看包裹退回信息详情
export const url_get_detail = "get|package-return/:id";
export const api_get_detail = function(id){
    return http(Url2(url_get_detail, {id:id}))
};

//待入库sku信息
export const url_get_info = "get|package-return/:id/storage-info";
export const api_get_info = function(id){
    return http(Url2(url_get_info, {id:id}))
};

//获取邮寄方式
export const url_get_shipping = "get|manual-orders/shipping";
export const api_get_shipping = function(data){
    return http(url_get_shipping,data);
};

//批量标记待入库
export const url_batch_storage = "post|package-return/batch/wait-for-storage";
export const api_batch_storage = function(data){
    return http(url_batch_storage,data);
};

//批量标记待重发
export const url_batch_reissued = "post|package-return/batch/wait-for-reissued";
export const api_batch_reissued = function(data){
    return http(url_batch_reissued, data);
};

//添加备注
export const url_post_note = "post|package-return/:id/note";
export const api_post_note = function(id, data){
    return http(Url2(url_post_note, {id:id}), data);
};

//批量标记入库
export const url_post_storage = "post|package-return/batch/storage";
export const api_post_storage = function(data){
    return http(url_post_storage,data);
};

//导出Execl
export const url_package_return_export = "post|package-return/export";
export const api_package_return_export = function(data){
    return http(url_package_return_export,data);
};

