import {http} from '../lib/http-plus';

//获取第三方仓库存借调申请列表
export const url_warehouse_goods_channel_log = "get|warehouse-goods-channel-log";
export const api_warehouse_goods_channel_log = function (data) {
    return http(url_warehouse_goods_channel_log, data);
};

//获取创建人列表
export const url_channel_log_creator = "get|warehouse-goods-channel-log/creator";
export const api_channel_log_creator = function () {
    return http(url_channel_log_creator);
};

//获取所有审批人列表
export const url_channel_log_all_auditor = "get|warehouse-goods-channel-log/get-all-verifier";
export const api_channel_log_all_auditor = function () {
    return http(url_channel_log_all_auditor);
};

//获取审批人列表
export const url_channel_log_auditor = "get|warehouse-goods-channel-log/auditor";
export const api_channel_log_auditor = function () {
    return http(url_channel_log_auditor);
};

//获取借调单详细
export const url_channel_log_read = "get|warehouse-goods-channel-log/:id";
export const api_channel_log_read = function (id) {
    return http(Url2(url_channel_log_read, {id:id}));
};

//借调单状态获取
export const url_channel_log_status = "get|warehouse-goods-channel-log/status";
export const api_channel_log_status = function () {
    return http(url_channel_log_status);
};

//借调审核通过
export const url_channel_log_audit = "post|warehouse-goods-channel-log/audit";
export const api_channel_log_audit = function (data) {
    return http(url_channel_log_audit, data);
};

//批量审核通过
export const url_channel_log_batch_audit = "post|warehouse-goods-channel-log/multi-audit";
export const api_channel_log_batch_audit = function (data) {
    return http(url_channel_log_batch_audit, data);
};

//借调审核不通过
export const url_channel_log_deny = "post|warehouse-goods-channel-log/deny";
export const api_channel_log_deny = function (data) {
    return http(url_channel_log_deny, data);
};

//批量借调审核不通过
export const url_channel_log_batch_deny = "post|warehouse-goods-channel-log/multi-deny";
export const api_channel_log_batch_deny = function (data) {
    return http(url_channel_log_batch_deny, data);
};

//根据借调单获取审批人
export const url_auditor_by_channel = "get|warehouse-goods-channel-log/verifier";
export const api_auditor_by_channel = function (data) {
    return http(url_auditor_by_channel, data);
};

//更改审批人
export const url_channel_log_change_auditor = "post|warehouse-goods-channel-log/changeAuditor";
export const api_channel_log_change_auditor = function (data) {
    return http(url_channel_log_change_auditor, data);
};

//批量更改审批人
export const url_channel_log_batch_change_auditor = "post|warehouse-goods-channel-log/multi-changeAuditor";
export const api_channel_log_batch_change_auditor = function (data) {
    return http(url_channel_log_batch_change_auditor, data);
};

//协调审核通过
export const url_coordinate_audit = "post|warehouse-goods-channel-log/coordinate-audit";
export const api_coordinate_audit = function (data) {
    return http(url_coordinate_audit, data);
};

//协调审核不通过
export const url_coordinate_deny = "post|warehouse-goods-channel-log/coordinate-deny";
export const api_coordinate_deny = function (data) {
    return http(url_coordinate_deny, data);
};

//批量协调审核通过
export const url_coordinate_batch_audit = "post|warehouse-goods-channel-log/mcoordinate-audit";
export const api_coordinate_batch_audit = function (data) {
    return http(url_coordinate_batch_audit, data);
};

//批量协调审核不通过
export const url_coordinate_batch_deny = "post|warehouse-goods-channel-log/mcoordinate-deny";
export const api_coordinate_batch_deny = function (data) {
    return http(url_coordinate_batch_deny, data);
};

