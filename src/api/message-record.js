/**
 * Created by user on 2018/8/23.
 * 更换api传参方式  Alison  2018/8/23
 */
import {http} from '../lib/http-plus';

//转派记录列表
export const url_message_record = "get|message-transfer/record";
export const api_message_record = function (data) {
    return http(url_message_record,data);
}

//转派操作人
export const url_message_creator = "get|message-transfer/creator";
export const api_message_creator = function (data) {
    return http(url_message_creator,data);
}