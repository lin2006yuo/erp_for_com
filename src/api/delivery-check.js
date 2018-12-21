/**
 * Created by Administrator on 2017/11/20.
 */
import {http} from '../lib/http-plus';

//单品包装扫拣货单
export const url_single_box = "post|delivery-check/single-box";
export const api_single_box = function (data) {
    return http(url_single_box, data, {
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};
//单品单件包裹列表
export const url_package_list = "get|delivery-check/package-list/:id";
export const api_package_list = function (id, data) {
    return http(Url2(url_package_list, {id: id}), data);
};
//退出单品复核
export const url_delivery_check_stop = "post|delivery-check/:id/stop";
export const api_delivery_check_stop = function (id, data) {
    return http(Url2(url_delivery_check_stop, {id: id}), data);
};
//单品包装扫sku
export const url_single_sku = "post|delivery-check/single-sku";
export const api_single_sku = function (data) {
    return http(url_single_sku, data);
};
//单品包装扫sku,单品多件确认
export const url_sure_sku = "post|delivery-check/sure-sku";
export const api_sure_sku = function (data) {
    return http(url_sure_sku, data);
};
//按单复核
export const url_check_shipping_number = "post|delivery-check/check-shipping-number";
export const api_check_shipping_number = function (data) {
    return http(url_check_shipping_number, data);
};
//按单复核完成确定
export const url_print_shipping_number = "post|delivery-check/print-shipping-number";
export const api_print_shipping_number = function (data) {
    return http(url_print_shipping_number, data);
};
//按单复核确认异常
export const url_confirm_error = "post|delivery-check/:id/confirm-error";
export const api_confirm_error = function (id) {
    return http(Url2(url_confirm_error, {id: id}));
};
//多品分拣 (扫描周转箱号)
export const url_check_turnover_box = "post|delivery-check/check-turnover-box";
export const api_check_turnover_box = function (data) {
    return http(url_check_turnover_box, data);
};
//获取播种车
export const url_sorting_shelf_lists = "get|sorting-shelf/lists";
export const api_sorting_shelf_lists = function (data) {
    return http(url_sorting_shelf_lists, data);
};
//多品分拣确认
export const url_audit_turnover_box = "post|delivery-check/audit-turnover-box";
export const api_audit_turnover_box = function (data) {
    return http(url_audit_turnover_box, data);
};
//正在包装作业中信息
export const url_pickings_packing = "get|pickings/packing";
export const api_pickings_packing = function (data) {
    return http(url_pickings_packing, data);
};
//正在拣货列表信息
export const url_pickings_sorting = "get|pickings/sorting";
export const api_pickings_sorting = function (data) {
    return http(url_pickings_sorting, data);
};
//二次分拣（扫描sku）
export const url_twice_sorting = "post|delivery-check/twice-sorting";
export const api_twice_sorting = function (data) {
    return http(url_twice_sorting, data);
};
//周转篮信息（二次分拣）
export const url_basket_info = "get|delivery-check/basket-info";
export const api_basket_info = function (data) {
    return http(url_basket_info, data);
};
//播种车信息（二次分拣）
export const url_picking_id = "get|delivery-check/grid-info/:id";
export const api_picking_id = function (id) {
    return http(Url2(url_picking_id, {id: id}));
};
//将所有周转篮重置未开始分拣
export const url_reset_twice_soring = "post|delivery-check/reset-twice-soring/:id";
export const api_reset_twice_soring = function (id) {
    return http(Url2(url_reset_twice_soring, {id: id}));
};
//将周转篮重置为未开始分拣
export const url_reset_basket = "post|delivery-check/reset-basket";
export const api_reset_basket = function (data) {
    return http(url_reset_basket, data);
};
//周转篮列表（二次分拣）
export const url_basket_list = "get|delivery-check/basket-list/:id";
export const api_basket_list = function (id) {
    return http(Url2(url_basket_list, {id: id}));
};
//打印
export const url_delivery_check_print = "post|delivery-check/:package_id/print";
export const api_delivery_check_print = function (package_id, data) {
    return http(Url2(url_delivery_check_print, {package_id: package_id}), data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: 30000
    });
};
//批量打印
export const url_delivery_check_prints = "post|delivery-check/batch-print";
export const api_delivery_check_prints = function (data) {
    return http(url_delivery_check_prints, data);
};
//批量打印---多品分拣
export const url_delivery_check_batch_print_basket = "post|delivery-check/batch-print-basket";
export const api_delivery_check_batch_print_basket = function (data) {
    return http(url_delivery_check_batch_print_basket, data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: 30000
    });
};
//退出二次分拣
export const url_delivery_check_stop_picking = "post|delivery-check/:id/stop-picking";
export const api_delivery_check_stop_picking = function (id) {
    return http(Url2(url_delivery_check_stop_picking, {id: id}));
};
//批量重新复核
export const url_delivery_check_batch_reset_single = "post|delivery-check/batch-reset-single";
export const api_delivery_check_batch_reset_single = function (data) {
    return http(url_delivery_check_batch_reset_single, data);
};
//清除扫描参数--单品多件
export const url_delivery_check_flush_checking = "post|delivery-check/flush-checking";
export const api_delivery_check_flush_checking = function (data) {
    return http(url_delivery_check_flush_checking, data);
};
//补打面单
export const url_print_label = "post|delivery-check/print-label";
export const api_print_label = function (data) {
    return http(url_print_label, data);
};
//释放周转箱
export const url_delivery_check_stop_turnover_box = "post|delivery-check/stop-turnover-box";
export const api_delivery_check_stop_turnover_box = function (data) {
    return http(url_delivery_check_stop_turnover_box, data);
};
//退出周转箱/delivery-check/sure-stop-box
export const url_delivery_check_sure_stop_box = "post|delivery-check/sure-stop-box";
export const api_delivery_check_sure_stop_box = function (data) {
    return http(url_delivery_check_sure_stop_box, data);
};

//释放拣货单查询
export const url_stop_single_picking = "get|delivery-check/stop-single-picking";
export const api_stop_single_picking = function (data) {
    return http(url_stop_single_picking, data)
};
//释放拣货单确认
export const url_sure_stop_single_picking = "post|delivery-check/sure-stop-single-picking";
export const api_sure_stop_single_picking = function (data) {
    return http(url_sure_stop_single_picking, data)
};
//批量打印标签
export const url_print_basket_label="post|delivery-check/batch/print-basket-label";
export const api_print_basket_label = function (data) {
    return http(url_print_basket_label, data)
};
//打印拣货单引导标签
export const url_picking_label_info = "get|delivery-check/picking-label-info";
export const api_picking_label_info = function (data) {
    return http(url_picking_label_info, data);
};
//长沙EUB换打面单
export const url_print_change_label = "post|delivery-check/print-change-label";
export const api_print_change_label = function (data) {
    return http(url_print_change_label, data);
};

//获取百度语音token
export const url_get_baidu_token = "get|delivery-check/get-baidu-token";
export const api_get_baidu_token = function () {
    return http(url_get_baidu_token);
};

//单品单件拣货单批量包装
export const url_label_check = "post|delivery-check/label-check ";
export const api_label_check = function (data) {
    return http(url_label_check,data);
};

//单品包装缓存列表
export const url_get_watch_cache = "get|delivery-check/:id/watch-cache";
export const api_get_watch_cache = function (id) {
    return http(Url2(url_get_watch_cache, {id}));
};

//单品包装清除缓存
export const url_delete_watch_cache = "post|delivery-check/delete/watch-key";
export const api_delete_watch_cache = function (data) {
    return http(url_delete_watch_cache, data);
};

//排除法批量包装
export const url_exclusion_check = "post|delivery-check/exclusion-check";
export const api_exclusion_check = function (data) {
    return http(url_exclusion_check, data);
};