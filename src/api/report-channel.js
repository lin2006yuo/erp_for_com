/**
 * Created by wuchuguang on 17-1-20.
 */
import {http} from '../lib/http-plus';

//获取渠道平台
export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};

export const url_get_channel_categories = "get|channel-categories";
export const api_get_channel_categories = function () {
    return http(url_get_channel_categories, {});
};

//获取运输方式
export const url_get_shipping = "get|shipping-method/list-order";
export const api_get_shipping = function(data){
    return http(url_get_shipping,data);
};

//仓库
export const url_get_warehouse = "get|warehouse/info";
export const api_get_warehouse = function(data){
    return http(url_get_warehouse,data);
};

export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};

//eBay平台利润报表接口
export const url_report_eBay = "get|report/financial/profit-statement";
export const api_report_eBay = function(datas){
    return http(url_report_eBay, datas);
};

//亚马逊平台利润报表接口
export const url_report_Amazon = "get|report/financial/profit-statement/amazon";
export const api_report_Amazon = function(datas){
    return http(url_report_Amazon, datas);
};

//wish平台利润报表接口
export const url_report_wish = "get|report/financial/profit-statement/wish";
export const api_report_wish = function(datas){
    return http(url_report_wish, datas);
};

//速卖通平台利润报表接口
export const url_report_aliexpress = "get|report/financial/profit-statement/ali-express";
export const api_report_aliexpress = function(datas){
    return http(url_report_aliexpress, datas);
};

//FBA利润报表接口
export const url_report_fba = "get|report/financial/profit-statement/fba";
export const api_report_fba = function(datas){
    return http(url_report_fba, datas);
};

//导出利润报表
export const url_export_report= "post|report/financial/export/profit-statement";
export const api_export_report = function(datas){
    return http(url_export_report, datas);
};

//获取订单货品
export const url_get_orders_skus= "get|report/financial/order/skus";
export const api_get_orders_skus = function(datas){
    return http(url_get_orders_skus, datas);
};

export const api_report_channel = function(){
    console.error(`not define api_report_channel`);
}

//joom平台利润报表接口
export const url_report_joom = "get|report/financial/profit-statement/joom";
export const api_report_joom = function(datas){
    return http(url_report_joom, datas);
};

//lazada平台利润报表接口
export const url_report_lazada = "get|report/financial/profit-statement/lazada";
export const api_report_lazada = function(datas){
    return http(url_report_lazada, datas);
};

//shopee平台利润报表接口
export const url_report_shopee = "get|report/financial/profit-statement/shopee";
export const api_report_shopee = function(datas){
    return http(url_report_shopee, datas);
};

//paytm平台利润报表接口
export const url_report_paytm = "get|report/financial/profit-statement/paytm";
export const api_report_paytm = function(datas){
    return http(url_report_paytm, datas);
};

//walmart平台利润报表接口
export const url_report_walmart = "get|report/financial/profit-statement/walmart";
export const api_report_walmart = function(datas){
    return http(url_report_walmart, datas);
};

//mymall平台利润报表接口
export const url_report_mymall = "get|report/financial/profit-statement/pandao";
export const api_report_mymall = function(datas){
    return http(url_report_mymall, datas);
};

//jumia平台利润报表接口
export const url_report_jumia = "get|report/financial/profit-statement/jumia";
export const api_report_jumia = function(datas){
    return http(url_report_jumia, datas);
};

//vova平台利润报表接口
export const url_report_vova = "get|report/financial/profit-statement/vova";
export const api_report_vova = function(datas){
    return http(url_report_vova, datas);
};

//umka平台利润报表接口
export const url_report_umka = "get|report/financial/profit-statement/umka";
export const api_report_umka = function(datas){
    return http(url_report_umka, datas);
};

//cd平台利润报表接口
export const url_report_cd = "get|report/financial/profit-statement/cd";
export const api_report_cd = function(datas){
    return http(url_report_cd, datas);
};

//newegg平台利润报表接口
export const url_report_newegg = "get|report/financial/profit-statement/newegg";
export const api_report_newegg = function(datas){
    return http(url_report_newegg, datas);
};

//oberlo平台利润报表接口
export const url_report_oberlo = "get|report/financial/profit-statement/oberlo";
export const api_report_oberlo = function(datas){
    return http(url_report_oberlo, datas);
};

//zoodmall平台利润报表接口
export const url_report_zoodmall = "get|report/financial/profit-statement/zoodmall";
export const api_report_zoodmall = function(datas){
    return http(url_report_zoodmall, datas);
};

//SKU销量动态表列表
export const url_sku_sales_dynamic = "get|report/sku-sales-dynamic";
export const api_sku_sales_dynamic = function (data) {
    return http(url_sku_sales_dynamic, data);
};

//SKU销量动态表列表导出
export const url_sku_sales_dynamic_export = "post|report/sku-sales-dynamic/export";
export const api_sku_sales_dynamic_export = function (data) {
    return http(url_sku_sales_dynamic_export, data);
};
//邮箱服务器列表/email-server
export const url_email_server = "get|email-server";
export const api_email_server = function (data) {
    return http(url_email_server, data);
};
//邮箱服务器保存
export const url_save_email_server = "post|email-server";
export const api_save_email_server = function (data) {
    return http(url_save_email_server, data);
};
//邮箱服务器编辑
export const url_edit_email_server = "get|email-server/:id/edit";
export const api_edit_email_server = function (id) {
    return http(Url2(url_edit_email_server,{id:id}));
};
//邮箱服务器删除 /email-server/:id/:account_id
export const url_delete_email_server = "delete|email-server/:id/:account_id";
export const api_delete_email_server = function (id,account_id) {
    return http(Url2(url_delete_email_server,{id:id,account_id:account_id}));
};
///email-server/:id
export const url_put_email_server = "put|email-server/:id";
export const api_put_email_server = function (id,data) {
    return http(Url2(url_put_email_server,{id:id}),data);
};
