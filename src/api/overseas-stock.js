/**
 * Created by Administrator on 2017/12/12.
 */
import {http} from '../lib/http-plus';
//海外仓库存列表
export const url_overseas_stock = "get|warehouse-goods/overseas";
export const api_overseas_stock = function (data) {
    return http(url_overseas_stock, data);
};
//第三方仓库存列表
export const url_third_stock = "get|warehouse-goods/third";
export const api_third_stock = function (data) {
    return http(url_third_stock, data);
};
//修改平台预警数接口
export const url_change_alert = "post|warehouse-goods/alert";
export const api_change_alert = function (data) {
    return http(url_change_alert, data);
};
//申请备货数量接口
export const url_warehouse_goods_apply = "post|warehouse-goods/apply";
export const api_warehouse_goods_apply = function (data) {
    return http(url_warehouse_goods_apply, data);
};
//申请备货数量
export const url_get_apply = "post|warehouse-goods/apply";
export const api_get_apply = function (data) {
    return http(url_get_apply, data);
};
//平台借调接口
export const url_get_lend = "post|warehouse-goods-channel/lend";
export const api_get_lend = function (data) {
    return http(url_get_lend, data);
};
//平台借调接口
export const url_get_logs = "get|warehouse-goods/logs";
export const api_get_logs = function (data) {
    return http(url_get_logs, data);
};
//平台分配
export const url_get_allot = "get|warehouse-goods/:id/allot";
export const api_get_allot = function (id, data) {
    return http(Url2(url_get_allot, {id: id}), data);
};
//平台分配库存接口
export const url_save_allot = "post|warehouse-goods/:id/allot";
export const api_save_allot = function (id, data) {
    return http(Url2(url_save_allot, {id: id}), data);
};
//备货申请表选择列表
export const url_choose_list = "get|stocking/:id/choose-list";
export const api_choose_list = function (id, data) {
    return http(Url2(url_choose_list, {id: id}), data);
};
//第三方库存同步到系统
export const url_sync_third_stock = "post|warehouse-goods/sync";
export const api_sync_third_stock = function (data) {
    return http(url_sync_third_stock, data);
};
//更新第三方库存
export const url_update_third_stock = "post|warehouse-goods/third-sync";
export const api_update_third_stock = function (data) {
    return http(url_update_third_stock, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};

//第三方仓导入期初库存
export const url_third_import = "post|warehouse-goods/third-import";
export const api_third_import = function (data) {
    return http(url_third_import, data);
};

//第三方仓批量入库
export const url_no_api_in = "post|warehouse-goods/no-api-in";
export const api_no_api_in = function (data) {
    return http(url_no_api_in, data);
};

//海外仓第三方仓平台分库存
export const url_channel_stock_detail = "get|warehouse-goods/channel-detail";
export const api_channel_stock_detail = function (data) {
    return http(url_channel_stock_detail, data);
};

//获取第三方仓库指定平台的申请调入库存信息
export const url_third_apply_allocate_in = "get|warehouse-goods/apply-allocate-in";
export const api_third_apply_allocate_in = function (data) {
    return http(url_third_apply_allocate_in, data);
};

//第三方仓库申请调入库存
export const url_third_allocate = "post|warehouse-goods/third-allocate";
export const api_third_allocate = function (data) {
    return http(url_third_allocate, data);
};
//海外仓库存列表（包括平台库存）
export const url_oversea_channel_detail = "get|warehouse-goods/oversea_channel_detail";
export const api_oversea_channel_detail = function (data) {
    return http(url_oversea_channel_detail, data);
};
//第三方仓列表（包括平台库存）
export const url_third_channel_detail = "get|warehouse-goods/third_channel_detail";
export const api_third_channel_detail = function (data) {
    return http(url_third_channel_detail, data);
};
//第三方仓（海外仓）库存批量借调申请
export const url_batch_allocate = "post|warehouse-goods/third-multi-allocate";
export const api_batch_allocate = function (data) {
    return http(url_batch_allocate, data);
}