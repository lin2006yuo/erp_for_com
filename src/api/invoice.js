/**
 * Created by user on 2017/4/14.
 */
import {http} from '../lib/http-plus';

//发票规则列表
export const url_invoice_rules = "get|invoice-rules"
export const invoice_rules = function(data){
  return http(url_invoice_rules, data);
};

//获取规则可选条件
export const url_invoice_item = "get|invoice-rules/items"
export const invoice_item = function(data){
  return http(url_invoice_item, data);
};

//获取条件资源信息 请求时间设置为1分钟
export const url_get_resource = "post|rules/resources";
export const get_resource = function(data){
  return http(url_get_resource, data,{
      contentType:'application/x-www-form-urlencoded',
      timeout:60000
  });
};

//获取模板信息
export const url_invoice_template = "get|invoice-template"
export const invoice_template = function(){
  return http(url_invoice_template);
};

//新增invoice自动规则
export const url_add_invoice_rules = "post|invoice-rules"
export const add_invoice_rules = function(data){
  return http(url_add_invoice_rules, data);
};

//获取编辑invoice自动规则信息
export const url_edit_invoice_rules = "get|invoice-rules/:id/edit"
export const edit_invoice_rules = function(id){
  return http(Url2(url_edit_invoice_rules,{id:id}));
};

//查看invoice自动规则信息
export const url_look_invoice_rules = "get|invoice-rules/:id"
export const look_invoice_rules = function(id){
  return http(Url2(url_look_invoice_rules,{id:id}));
};

//TODO 更新invoice自动规则  待定
export const url_update_invoice_rules = "put|invoice-rules/:id"
export const update_invoice_rules = function(id,data){
  return http(Url2(url_update_invoice_rules,{id:id}), data);
};

//   保存invoice规则排序
export const url_sort_invoice_rules = "post|invoice-rules/sort"
export const sort_invoice_rules = function(data){
  return http(url_sort_invoice_rules, data);
};

//更改invoice规则状态
export const url_change_status = "post|invoice-rules/:id/status/:value"
export const change_status = function(id,value){
  return http(Url2(url_change_status,{id:id,value:value}));
};

//删除invoice规则    invoice-rules/1
export const url_delete_invoice_rules = "delete|invoice-rules/:id"
export const delete_invoice_rules = function(id){
  return http(Url2(url_delete_invoice_rules,{id:id}));
};

//发票记录列表
export const url_get_invoices = "get|invoices"
export const get_invoices = function(data){
  return http(url_get_invoices, data);
};

//查看发票记录
export const url_look_invoices = "get|invoices/:id"
export const look_invoices = function(id){
  return http(Url2(url_look_invoices,{id:id}));
};

//单个/批量删除   invoices/batch
export const url_delete_invoices = "post|invoices/batch"
export const delete_invoices = function(data){
  return http(url_delete_invoices, data);
};

// 获取客户编号选项
export const url_code_info = "get|invoice-rules/code/info"
export const code_info = function(){
  return http(url_code_info);
};

//获取日期格式选项
export const url_format_info = "get|invoice-rules/format/info"
export const format_info = function(){
  return http(url_format_info);
};
