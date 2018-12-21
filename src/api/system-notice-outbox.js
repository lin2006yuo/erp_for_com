/**
 * Created by wuchuguang on 17-1-12.
 */

import {http} from '../lib/http-plus';

// 获取列表
export const url_get_internal_letters_sent_letter = "get|internal-letters/sent-letter";
export const api_get_internal_letters_sent_letter = function (data) {
    return http(url_get_internal_letters_sent_letter, data);
};
//查看已发邮件
export const url_get_internal_letters_view_sent_letter= "get|internal-letters/view-sent-letter";
export const api_get_internal_letters_view_sent_letter  = function(data) {
    return http(url_get_internal_letters_view_sent_letter, data);
};
//批量删除
export const url_internal_letters_delet_sent_letters = "post|internal-letters/delet-sent-letters";
export const api_internal_letters_delet_sent_letters = function (data) {
    return http(Url2(url_internal_letters_delet_sent_letters),data);
};
