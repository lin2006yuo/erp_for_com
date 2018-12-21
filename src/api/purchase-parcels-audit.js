/**
 * Created by RondaFul on 2017/1/13.
 */
import {http} from '../lib/http-plus';

//搜索
export const url_get_audit = "get|purchase-parcels-audit";
export const api_get_audit = function(data) {
    return http(Url2(url_get_audit),data);
};

//审批
export const url_post_audit = "post|purchase-parcels-audit";
export const api_post_audit = function(data) {
    return http(Url2(url_post_audit),data);
};
