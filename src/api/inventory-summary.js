import {http} from '../lib/http-plus';

//表格数据
export const url_invoicing = "get|invoicing/summary"
export const api_get_summary = function(data){
  return http(url_invoicing, data);
};
//表格数据-明细
export const url_invoicing_detail = "get|invoicing/detail"
export const api_get_detail = function(data){
    return http(url_invoicing_detail, data);
};
//汇总表导出
export const url_export_summary = "post|invoicing/export/summary"
export const api_export_summary = function(data){
  return http(url_export_summary, data);
};

//明细表导出
export const url_export_detail = "post|invoicing/export/detail"
export const api_export_detail = function(data){
  return http(url_export_detail, data);
};

