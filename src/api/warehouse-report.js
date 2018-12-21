import {http} from '../lib/http-plus';
//获取状态列表
export const url_export_report = "post|warehouse/report/export";
export const api_export_report = function(data){
    return http(url_export_report, data);
};
