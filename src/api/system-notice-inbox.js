/**
 * Created by wuchuguang on 17-1-12.
 */

import {http} from '../lib/http-plus';

//获取通知类型
export const url_get_internal_letter_get_all_type = "get|internal-letters/type";
export const api_get_internal_letter_get_all_type = function () {
    return http(url_get_internal_letter_get_all_type,);
};
// 获取列表
export const url_get_internal_letter_pull_received_letters = "get|internal-letters/received-letters";
export const api_get_internal_letter_pull_received_letters = function (data) {
    return http(url_get_internal_letter_pull_received_letters, data);
};
//批量删除
export const url_internal_letters_delete_received_letters = "delete|internal-letters/delete-received-letters";
export const api_internal_letters_delete_received_letters = function (data) {
    return http(Url2(url_internal_letters_delete_received_letters),data);
};
//收件箱查看
export const url_get_internal_letters_view_letter = "get|internal-letters/view-letter";
export const api_get_internal_letters_view_letter = function (data) {
    return http(url_get_internal_letters_view_letter, data);
};
//标记为已读/
export const url_put_internal_letters_read = "put|internal-letters/read";
export const api_put_internal_letters_read = function (data) {
    return http(url_put_internal_letters_read,data);
};
//站内信通知
export const url_get_internal_letters_notification = "get|internal-letters/notification";
export const api_get_internal_letters_notification = function (data) {
    return http(url_get_internal_letters_notification, data);
};
//通知弹窗全部标记已读
export const url_get_internal_letters_all_read = "put|internal-letters/all-read";
export const api_get_internal_letters_all_read = function () {
    return http(url_get_internal_letters_all_read);
};
