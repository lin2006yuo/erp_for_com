/**
 * Created by RondaFul on 2017/7/27.
 */
import {http} from '../lib/http-plus';

//获取垃圾箱的列表
export const url_get_ebay_emails_outbox ="get|ebay-emails/outbox";
export const api_get_ebay_emails_outbox = function(data) {
    return http(url_get_ebay_emails_outbox,data);
};
