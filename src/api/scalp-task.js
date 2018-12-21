/**
 * Created by wangyueru on 17-1-20.
 */
import {http} from '../lib/http-plus';

export const url_get_virtual_order_mission_list = 'get|virtual-order/mission-list';
export const api_get_virtual_order_mission_list = function (data) {
    return http(url_get_virtual_order_mission_list,data);
};
//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};
//账号
export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};
//获取状态
export const url_virtual_order = "get|virtual-order/status";
export const api_virtual_order = function(data){
    return http(url_virtual_order, data);
};
//获取销售员
export const url_get_sales = "get|user/:type/staffs";
export const api_get_sales = function(type,data){
    return http(Url2(url_get_sales,{type:'sales'}),data);
};
//1.1虚拟订单申请 virtual-order
export const post_virtual_order = "post|virtual-order";
export const api_post_virtual_order = function(data){
    return http(post_virtual_order,data);
};
//批量分配
export const  url_batch_allot = "post|virtual-order/batch/allot";
export const api_batch_allot = function (data) {
    return http(url_batch_allot,data);
};
//查看
export const url_look_over = "get|virtual-order/:id";
export const api_look_over = function (id) {
    return http(Url2(url_look_over,{id:id}));
};
//日志
export const url_open_log = "get|virtual-order/:id/logs";
export const api_open_log = function (id) {
    return http(Url2(url_open_log,{id:id}));
};
//sku详情订单
export const url_open_detail = "get|virtual-order/execute/:id";
export const api_open_detail = function (id) {
    return http(Url2(url_open_detail,{id:id}));
};
//部长审批
export const url_audit_minister = "post|virtual-order/audit/minister";
export const api_audit_minister = function (data) {
    return http(url_audit_minister,data);
};
//组长审批
export const url_audit_headman = "post|virtual-order/audit/headman";
export const api_audit_headman = function (data) {
    return http(url_audit_headman,data);
};
//批量作废
export const url_batch_cancel = "post|virtual-order/batch/cancel";
export const api_batch_cancel = function (data) {
    return http(url_batch_cancel,data);
};
//保存
export const url_execute_save = "post|virtual-order/execute/save";
export const api_execute_save = function (data) {
    return http(url_execute_save,data);
};
//提交
export const url_execute_submit = "post|virtual-order/execute/submit";
export const api_execute_submit = function (data) {
    return http(url_execute_submit,data);
};
//导入
export const url_virtual_order_import = "post|virtual-order/import";
export const api_virtual_order_import = function (data) {
    return http(url_virtual_order_import,data);
};
//获取类型btn
export const url_virtual_order_mission_type = "get|virtual-order/mission-type";
export const api_virtual_order_mission_type = function(data){
    return http(url_virtual_order_mission_type, data);
};
//指定负责人
export const url_virtual_order_mission_allocation = "post|virtual-order/mission/allocation";
export const api_virtual_order_mission_allocation = function (data) {
    return http(url_virtual_order_mission_allocation,data);
};
//获取状态btn
export const url_virtual_order_mission_status = "get|virtual-order/mission/status";
export const api_virtual_order_mission_status = function(){
    return http(url_virtual_order_mission_status);
};
//指定买家
export const url_virtual_order_mission_buyer = "post|virtual-order/mission/buyer";
export const api_virtual_order_mission_buyer = function (data) {
    return http(url_virtual_order_mission_buyer,data);
};
//获取买家列表
export const url_virtual_order_buyer_list = "get|virtual-order/buyer-list";
export const api_virtual_order_buyer_list = function(data){
    return http(url_virtual_order_buyer_list,data);
};
