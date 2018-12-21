/**
 * Created by wuchuguang on 17-1-12.
 */

import {http} from '../lib/http-plus';


//发送站内信
export const url_post_internal_letters = "post|internal-letters";
export const api_post_internal_letters = function (data) {
    return http(url_post_internal_letters,data);
};
//保存到草稿
export const url_post_internal_letters_draftbox = "post|internal-letters/draftbox";
export const api_post_internal_letters_draftbox = function (data) {
    return http(url_post_internal_letters_draftbox,data);
};
