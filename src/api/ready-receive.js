import {http} from '../lib/http-plus';

//创建接收包裹
export const url_ready_receive = "post|purchase-parcels/ready-receive";
export const api_ready_receive = function (data) {
    return http(url_ready_receive, data);
};

//查看预接收包裹信息
export const url_ready_receive_info = "get|purchase-parcels/ready-receive";
export const api_ready_receive_info = function (data) {
    return http(url_ready_receive_info, data);
};

//修改预接收包裹信息
export const url_ready_receive_edit = "put|purchase-parcels/ready-receive";
export const api_ready_receive_edit = function (data) {
    return http(url_ready_receive_edit, data);
};

//标记收包异常
export const url_receive_abnormal_mark = "post|purchase-parcels/receive-abnormal";
export const api_receive_abnormal_mark = function (data) {
    return http(url_receive_abnormal_mark, data);
};

//查看收报异常列表
export const url_receive_abnormal = "get|purchase-parcels/receive-abnormal";
export const api_receive_abnormal = function (data) {
    return http(url_receive_abnormal, data);
};

//回复处理
export const url_reply_letter = "put|purchase-parcels/reply-letter";
export const api_reply_letter = function (data) {
    return http(url_reply_letter, data);
};

//批量标记已处理
export const url_process_status = "put|purchase-parcels/process-status";
export const api_process_status = function (data) {
    return http(url_process_status, data);
};

//收货管理包裹异常具体数量
export const url_abnormal_count = "get|purchase-parcels/abnormal-count";
export const api_abnormal_count = function () {
    return http(url_abnormal_count);
}