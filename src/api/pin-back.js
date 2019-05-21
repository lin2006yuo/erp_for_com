/**
 * Created by Administrator on 2017/10/24.
 */
import {http} from '../lib/http-plus';

//获取销退列表
export const url_get_refund = "get|report/sale-refund";
export const api_get_refund = function(data){
    return http(Url2(url_get_refund), data);
};

//销退列表导出
export const url_export_refund = "post|report/sale-refund/export";
export const api_export_refund = function(data){
    return http(Url2(url_export_refund), data);
};