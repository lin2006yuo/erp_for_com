import {http} from '../lib/http-plus';

//获取刷单任务列表
export const url_get_click_farm_mission = "get|virtual-order/mission-list";
export const api_get_click_farm_mission = function (data) {
    return http(url_get_click_farm_mission, data);
};

//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};

//获取站点、账号简称
export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};

//获取刷单任务详情
export const url_get_mission_details = "get|virtual-order/mission/:id";
export const api_get_mission_details = function (id,data) {
    return http(Url2(url_get_mission_details,{id: id}),data)
};

//获取刷单类型
export const url_get_mission_type = "get|virtual-order/mission-type";
export const api_get_mission_type = function(){
    return http(url_get_mission_type);
};

//获取任务状态
export const url_get_mission_status = "get|virtual-order/mission/status";
export const api_get_mission_status = function(data){
    return http(url_get_mission_status, data);
};

//获取买家列表
export const url_get_buyer_list = "get|virtual-order/buyer-list";
export const api_get_buyer_list = function(data){
    return http(url_get_buyer_list, data);
};

//获取负责人列表
export const url_get_principal_list = "get|virtual-order/principal-list";
export const api_get_principal_list = function(){
    return http(url_get_principal_list);
};

//获取买手列表
export const url_get_buyers = "get|local-buyers";
export const api_get_buyers = function (data) {
    return http(url_get_buyers, data);
};

//指定买家
export const url_post_buyers = "post|virtual-order/mission/buyer";
export const api_post_buyers = function (data) {
    return http(url_post_buyers, data);
};

//自动指定买家
export const url_post_buyers_automation = "post|virtual-order/mission/buyer-automation";
export const api_post_buyers_automation = function (data) {
    return http(url_post_buyers_automation, data);
};

//指定负责人
export const url_post_allocation = "post|virtual-order/mission/allocation";
export const api_post_allocation = function (data) {
    return http(url_post_allocation, data);
};

//获取操作日志
export const url_get_mission_log = "get|virtual-order/mission/:id/logs";
export const api_get_mission_log = function (id,data) {
    return http(Url2(url_get_mission_log, {id:id}), data);
};

//首次返款申请单
export const url_get_refund_task = "get|virtual-refund/get-task";
export const api_get_refund_task = function (data) {
    return http(url_get_refund_task, data)
};

//提交/重新申请返款申请单
export const url_post_add_refund = "post|virtual-refund/add-refund";
export const api_post_add_refund = function (data) {
    return http(url_post_add_refund, data)
};