/**
 * Created by wuchuguang on 17-1-12.
 */

import {http} from '../lib/http-plus';

// 获取列表
export const url_get_progress = "get|progress";
export const api_get_progress = function (data) {
    return http(url_get_progress, data);
};
//添加日记
export const url_add_progress= "post|progress/add";
export const api_add_progress  = function(data) {
    return http(Url2(url_add_progress), data);
};
//更改状态
export const url_progress_update_status = "post|progress/update-status";
export const api_progress_update_status = function (data) {
    return http(Url2(url_progress_update_status),data);
};
//批量删除
export const url_progress_batch_delete = "delete|progress-delete";
export const api_progress_batch_delete = function (data) {
    return http(Url2(url_progress_batch_delete),data);
};
//新增请求编辑权限
export const url_get_progress_permission = "get|progress-permission";
export const api_get_progress_permission = function (data) {
    return http(url_get_progress_permission , data);
};
