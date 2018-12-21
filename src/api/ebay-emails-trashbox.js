/**
 * Created by RondaFul on 2017/7/27.
 */
import {http} from '../lib/http-plus';

//获取垃圾箱的列表
export const url_get_ebay_emails_trashbox ="get|ebay-emails/trashbox";
export const api_get_ebay_emails_trashbox = function(data) {
    return http(url_get_ebay_emails_trashbox,data);
};
//转到收件箱
export const url_get_ebay_emails_turn_inbox ="put|ebay-emails/turn-inbox";
export const api_get_ebay_emails_turn_inbox = function(data) {
    return http(url_get_ebay_emails_turn_inbox,data);
};
