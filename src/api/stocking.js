/**
 * Created by Administrator on 2017/12/13.
 */
import {http} from '../lib/http-plus';
//备货申请列表
export const url_apply_list = "get|stocking/apply-list";
export const api_apply_list = function (data) {
    return http(url_apply_list, data, {
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};
//确认备货
export const url_stocking_batch_sure = "put|stocking/batch/sure";
export const api_stocking_batch_sure = function (data) {
    return http(url_stocking_batch_sure, data);
};
//批量删除
export const url_stocking_batch_delete = "delete|stocking/batch/delete";
export const api_stocking_batch_delete = function (data) {
    return http(url_stocking_batch_delete, data);
};
//备货计划--状态
export const url_stocking_status = "get|stocking/status";
export const api_stocking_status = function (data) {
    return http(url_stocking_status, data);
};
//备货计划--开发处理状态
export const url_stocking_develop_status = "get|stocking/development-status";
export const api_stocking_develop_status = function (data) {
    return http(url_stocking_develop_status, data);
};
//备货计划--采购处理状态
export const url_stocking_purchase_status = "get|stocking/purchase-status";
export const api_stocking_purchase_status = function (data) {
    return http(url_stocking_purchase_status, data);
};
//备货计划--列表
export const url_stocking = "get|stocking";
export const api_stocking = function (data) {
    return http(url_stocking, data);
};
//备货计划--查看
export const url_stocking_look = "get|stocking/:id";
export const api_stocking_look = function (id) {
    return http(Url2(url_stocking_look, {id: id}));
};
//备货计划--审核
export const url_stocking_audit = "put|stocking/:id/audit";
export const api_stocking_audit = function (id, data) {
    return http(Url2(url_stocking_audit, {id: id}), data);
};
//备货计划--生成采购计划
export const url_stocking_sku_list = "get|stocking/sku-list";
export const api_stocking_sku_list = function (data) {
    return http(url_stocking_sku_list, data);
};
//获取当前备货申请可加入的备货计划
export const url_related_plan = "get|stocking/related-plan";
export const api_related_plan = function (data) {
    return http(url_related_plan, data)
};

//备货计划--提交审核
export const url_stock_batch_commit = "put|stocking/batch/commit";
export const api_stock_batck_commit = function (data) {
    return http(url_stock_batch_commit, data);
};

//备货计划--备货明细删除sku
export const url_stock_delete_sku = "delete|stocking/:id/sku/:sku_id";
export const api_stock_delete_sku = function (id, sku_id) {
    return http(Url2(url_stock_delete_sku, {id: id, sku_id: sku_id}));
};

//备货计划--释放库存
export const url_stock_release_inventory = "post|stocking/batch-release";
export const api_stock_release_inventory = function (data) {
    return http(url_stock_release_inventory, data);
};

//备货计划--作废
export const url_stock_cancel = "delete|stocking/:id";
export const api_stock_cancel = function (id, data) {
    return http(Url2(url_stock_cancel, {id: id}), data);
};

//备货计划--导出
export const url_stock_export = "post|stocking/export";
export const api_stock_export = function(data,head){
    return http(url_stock_export,data,head)
};

//获取导出标题
export const url_stock_export_title = "get|stocking/export-title";
export const api_stock_export_title = function () {
    return http(url_stock_export_title);
};

//备货计划--编辑提交
export const url_stock_edit = "put|stocking/:id";
export const api_stock_edit = function (id, data) {
    return http(Url2(url_stock_edit, {id: id}), data);
};

//备货计划--添加备货计划名称
export const url_stock_remark = "put|stocking/:id/remark";
export const api_stock_remark = function (id, data) {
    return http(Url2(url_stock_remark, {id: id}), data);
};

//审核日志
export const url_audit_log = "get|stocking/:id/audit-log";
export const api_audit_log = function (id) {
    return http(Url2(url_audit_log, {id: id}));
};

//审核不通过
export const url_delete_stock = "delete|stocking/:id";
export const api_delete_stock = function (id, data) {
    return http(Url2(url_delete_stock, {id: id}), data);
};

//通过备货计划单号获取备货详情列表
export const url_stock_list_by_code = "get|stocking/list-by-code";
export const api_stock_list_by_code = function (data) {
    return http(url_stock_list_by_code, data);
};