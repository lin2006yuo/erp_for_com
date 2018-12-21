/**
 * Created by wuchuguang on 16-11-2.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';
export const url_get_categories = "put|classify/add";
export const add = function (data) {
    return http(url_get_categories,data);
};