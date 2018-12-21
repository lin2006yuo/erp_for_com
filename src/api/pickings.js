/**
 * Created by Administrator on 2017/11/10.
 */
import {http} from '../lib/http-plus';

export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function () {
    return http(url_entrepot_picking)
};

//获取拣货单状态
export const url_get_pickingstatus = "get|pickings/status";
export const api_get_pickingstatus = function () {
    return http(url_get_pickingstatus)
};

//获取拣货单类型
export const url_get_pickingtype = "get|pickings/type";
export const api_get_pickingtype = function (data) {
    return http(Url2(url_get_pickingtype), data)
};

//获取运输方式
export const url_get_shipping = "get|pickings/shipping";
export const api_get_shipping = function (data) {
    return http(url_get_shipping, data)
};

//获取拣货单列表
export const url_get_pickings = "get|pickings";
export const api_get_pickings = function (data) {
    return http(Url2(url_get_pickings), data)
};

//获取子拣货单
export const url_get_subpickings = "get|pickings/:id/sub";
export const api_get_subpickings = function (id, data) {
    return http(Url2(url_get_subpickings, {id: id}), data)
};

//查看拣货单列表
export const url_look_pickings = "get|pickings/:id";
export const api_look_pickings = function (id, data) {
    return http(Url2(url_look_pickings, {id: id}), data)
};

//拣货单商品详情
export const url_detail_pickings = "get|pickings/:id/detail";
export const api_detail_pickings = function (id, data) {
    return http(Url2(url_detail_pickings, {id: id}), data)
};

//快速发货区拣货单包裹列表
export const url_quick_package = "get|pickings/quick-picking-package";
export const api_quick_package = function (data) {
    return http(Url2(url_quick_package), data)
};

//快速发货区商品详情
export const url_quick_detail = "get|pickings/quick-picking-detail";
export const api_quick_detail = function (data) {
    return http(Url2(url_quick_detail), data)
};

//快速发货区包裹移除
export const url_remove_package = "post|pickings/quick-picking-remove";
export const api_remove_package = function (data) {
    return http(Url2(url_remove_package), data)
};

//等待生成拣货单
export const url_wait_picking = "get|wait-for-make-picking";
export const api_wait_picking = function (data) {
    return http(Url2(url_wait_picking), data)
};
//未符合生成拣货单包裹列表
export const not_conforming_picking = "get|wait-for-make-picking/not-conforming";
export const api_not_conforming_picking = function (data) {
    return http(Url2(not_conforming_picking), data)
};

//等待生成拣货单邮寄方式
export const url_wait_picking_shipping = "get|wait-for-make-picking/shipping";
export const api_wait_picking_shipping = function (data) {
    return http(Url2(url_wait_picking_shipping), data)
};

//等待包装包裹列表
export const url_wait_packing = "get|wait-for-packing";
export const api_wait_packing = function (data) {
    return http(Url2(url_wait_packing), data)
};

//等待包装邮寄方式
export const url_wait_packing_shipping = "get|wait-for-packing/shipping";
export const api_wait_packing_shipping = function (data) {
    return http(Url2(url_wait_packing_shipping), data)
};

//打印包裹
export const url_print_package = "post|delivery-check/:package_id/print";
export const api_print_package = function (id) {
    return http(Url2(url_print_package, id))
};

//作废拣货单
export const url_invalid_pickings = "post|pickings/:id/invalid";
export const api_invalid_pickings = function (id, data) {
    return http(Url2(url_invalid_pickings, {id: id}), data)
};

//打印拣货单
export const url_print_pickings = "get|pickings/:id/print";
export const api_print_pickings = function (id, data) {
    return http(Url2(url_print_pickings, {id: id}), data)
};

//打印面单
export const url_print_label = "get|pickings/:id/label";
export const api_print_label = function (id, data) {
    return http(Url2(url_print_label, {id: id}), data)
};

//包裹列表
export const url_get_packages = "get|pickings/:id/packages";
export const api_get_packages = function (id, data) {
    return http(Url2(url_get_packages, {id: id}), data)
};

//拣货单包裹状态列表
export const url_get_packages_status = "get|pickings/package/status";
export const api_get_packages_status = function (id, data) {
    return http(Url2(url_get_packages_status, {id: id}), data)
};

//标记完成拣货
export const url_complete_packages = "post|pickings/:id/complete";
export const api_complete_packages = function (id, data) {
    return http(Url2(url_complete_packages, {id: id}), data)
};

//转交拣货单
export const url_pickings_shipper = "post|pickings/:id/shipper";
export const api_pickings_shipper = function (id, data) {
    return http(Url2(url_pickings_shipper, {id: id}), data)
};

//标记为包装完成
export const url_sign_packing = "post|pickings/:id/sign-packing-complete";
export const api_sign_packing = function (id, data) {
    return http(Url2(url_sign_packing, {id: id}), data)
};

//获取pdf的路径
export const url_get_pdf = "get|packages/:id/preview";
export const api_get_pdf = function (id) {
    return http(Url2(url_get_pdf, {id: id}))
};

//获取拣货异常列表数据
export const url_pickings_exception = "get|pickings-exception/exception";
export const api_pickings_exception = function (data) {
    return http(url_pickings_exception, data);
};

//打印发票
export const url_print_invoice = "get|pickings/:id/invoice";
export const api_print_invoice = function (id) {
    return http(Url2(url_print_invoice, {id: id}))
};

//周转箱
export const url_look_turnover = "get|pickings/:id/turnover";
export const api_look_turnover = function (id) {
    return http(Url2(url_look_turnover, {id: id}))
};

//打印面单号
export const url_post_print = "post|delivery-check/:package_id/print";
export const api_post_print = function (id) {
    return http(Url2(url_post_print, id));
};
//查看异常包裹详情pickings/exception-detail
export const url_pickings_exception_detail = "get|pickings-exception/exception-detail";
export const api_pickings_exception_detail = function (data) {
    return http(Url2(url_pickings_exception_detail), data)
};

//标记为正在拣货
export const url_picking_process = "post|pickings/:id/picking-process";
export const api_picking_process = function (id, data) {
    return http(Url2(url_picking_process, {id: id}), data)
};

//标记为集结完成
export const url_picking_massed = "post|pickings/:id/picking-massed";
export const api_picking_massed = function (id, data) {
    return http(Url2(url_picking_massed, {id: id}), data)
};

//获取拣货单操作日志
export const url_picking_log = "get|pickings/:id/log";
export const api_picking_log = function (id, data) {
    return http(Url2(url_picking_log, {id: id}), data)
};

//标记为等待分拣
export const url_wait_sorting = "post|pickings/:id/wait-sorting";
export const api_wait_sorting = function (id, data) {
    return http(Url2(url_wait_sorting, {id: id}), data);
};

//打印详细面单
export const url_print_detail_label = "get|pickings/:id/detail-label";
export const api_print_detail_label = function (id) {
    return http(Url2(url_print_detail_label, {id: id}));
};
//生成盘点单
export const url_goods_check = "post|pickings-exception/goods-check";
export const api_goods_check = function (data) {
    return http(url_goods_check, data);
};
//等待生成拣货单SKU列表
export const url_wait_picking_sku = "get|wait-for-make-picking/sku";
export const api_wait_picking_sku = function (data) {
    return http(url_wait_picking_sku, data);
};
//获取周转箱商品信息
export const url_goods_by_turnover = "get|pickings/:id/turnover/detail";
export const api_goods_by_turnover = function (id, data) {
    return http(Url2(url_goods_by_turnover, {id}), data);
};
//转移周转箱
export const url_transfer_turnover = "post|pickings/:id/turnover/transfer";
export const api_transfer_turnover = function (id, data) {
    return http(Url2(url_transfer_turnover, {id}), data);
}