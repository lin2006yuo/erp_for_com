/**
 * Created by wuchuguang on 17-1-12.
 */

import {http} from '../lib/http-plus';

// 获取列表
export const url_get_internal_letters_draft = "get|internal-letters/draft";
export const api_get_internal_letters_draft = function (data) {
    return http(url_get_internal_letters_draft, data);
};
//编辑草稿
export const url_get_internal_letters_draft_rewrite= "get|internal-letters/draft-edit";
export const api_get_internal_letters_draft_rewrite  = function(data) {
    return http(Url2(url_get_internal_letters_draft_rewrite), data);
};
//批量删除
export const url_internal_letters_draft_delete = "delete|internal-letters/draft-delete";
export const api_internal_letters_draft_delete = function (data) {
    return http(Url2(url_internal_letters_draft_delete),data);
};
//批量发送
export const url_post_internal_letters_batch_send= "post|internal-letters/batch-send";
export const api_post_internal_letters_batch_send  = function(data) {
    return http(Url2(url_post_internal_letters_batch_send), data);
};
//查看草稿
export const url_get_internal_letters_view_draft = "get|internal-letters/view-draft";
export const api_get_internal_letters_view_draft = function (data) {
    return http(url_get_internal_letters_view_draft, data);
};
