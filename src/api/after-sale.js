/**
 * Created by user on 2017/3/24.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

//售后处理列表
export const url_after_sale = "get|order-sales";
export const after_sale = function (data) {
    return http(url_after_sale,data);
}

//审核状态
export const url_approval_status = "get|order-sales/approval/info";
export const approval_status = function (data) {
    return http(url_approval_status,data)
}
//执行状态
export const url_execute_status = "get|order-sales/execute/info";
export const execute_status = function () {
    return http(url_execute_status)
}
//销售渠道
export const url_get_channels = "get|order-sales/channels";
export const get_channels = function () {
    return http(url_get_channels);
}
//原因选项
export const url_get_reason = "get|sale-reasons";
export const get_reason = function () {
    return http(url_get_reason)
}
//查找订单
export const url_get_find = "get|order-sales/find";
export const get_find = function (data) {
    return http(url_get_find,data);
}
//获取国家
export const url_get_country = "get|country";
export const api_get_country = function () {
    return http(url_get_country)
}
//获取运输方式
export const url_get_postway= 'get|orders/shipping/info';
export const api_get_postway= function(){
    return http(url_get_postway);
};
//获取仓库
export const url_get_warehouse = "get|orders/warehouse/info";
export const api_get_warehouse = function () {
    return http(url_get_warehouse)
}
//新增售后订单
export const url_add_order = "post|order-sales";
export const api_add_order = function (data) {
    return http(url_add_order,data)
}
//查看
export const url_look_over = "get|order-sales/:id";
export const api_look_over = function (id) {
    return http(Url2(url_look_over,{id:id}));
}
//编辑
export const url_edit = "get|order-sales/:id/edit";
export const api_get_edit = function (id) {
    return http(Url2(url_edit,{id:id}))
}
//更新
export const url_update = "put|order-sales/:id";
export const api_update = function (id,data) {
    return http(Url2(url_update,{id:id}),data)
}
//删除
export const url_delete = "delete|order-sales/:id";
export const api_delete = function (id) {
    return http(Url2(url_delete,{id:id}));
}
//新增原因
export const url_add_reason = "post|sale-reasons";
export const add_reason = function (data) {
    return http(url_add_reason,data);
}
//删除原因
export const url_delete_reason = "delete|sale-reasons/:id";
export const delete_reason = function (id) {
    return http(Url2(url_delete_reason,{id:id}))
}
//审批通过
export const url_adopt_status = "post|order-sales/adopt/status";
export const adopt_status = function (id) {
    return http(url_adopt_status,{id:id});
}
//退回修改
export const url_retreat_status = "post|order-sales/retreat/status";
export const retreat_status = function (data) {
    return http(url_retreat_status,data);
}
//标记为退款完成
export const url_complete_status = "post|order-sales/complete/status";
export const api_complete_status = function (id) {
    return http(url_complete_status, id);
}
//退款重新执行
export const url_again_status = "post|order-sales/again/status";
export const again_status = function (id) {
    return http(url_again_status,{id:id})
}

//获取导出execl字段
export const url_export_title = 'get|order-sales/export-title';
export const api_export_title = function(data) {
    return http(url_export_title,data);
}

//售后处理导出execl
export const url_sales_export = "post|order-sales/export";
export const api_sales_export = function(data,head) {
    return http(url_sales_export,data,head);
}

//首页审核通过
export const url_batch_adopt = "post|order-sales/batch-adopt";
export const api_batch_adopt = function (data) {
    return http(url_batch_adopt,data);
}

//首页返回修改
export const url_batch_retreat = "post|order-sales/batch-retreat";
export const api_retreat_status = function (data) {
    return http(url_batch_retreat,data);
};

//首页提交审核
export const url_batch_submit = "post|order-sales/batch-update";
export const api_batch_submit = function (data) {
    return http(url_batch_submit,data);
};
//获取来源类型
export const url_order_sales_source_type_info = "get|order-sales/sourceType/info";
export const api_order_sales_source_type_info = function () {
    return http(url_order_sales_source_type_info);
}
//选择发票规则
export const url_order_sales_invoice_rules = "get|invoice-rules";
export const api_order_sales_invoice_rules = function () {
    return http(url_order_sales_invoice_rules);
}

