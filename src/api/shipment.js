/**
 * Created by alison on 16-11-28.
 */
import {http} from '../lib/http-plus';

//本地仓物流商下单列表
export const url_placeorder = 'get|placeorder';
export const placeorder = function (data) {
    return http(url_placeorder, data, {
        contentType:'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};

//海外第三方仓物流商下单列表
export const url_third_placeorder = 'get|placeorder';
export const api_third_placeorder = function (data) {
    return http(url_placeorder, data, {
        contentType:'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};

//获取运输方式
export const url_get_shipping_method = 'get|placeorder/shipping-method';
export const api_get_shipping_method = function (data) {
    return http(url_get_shipping_method, data, {
        contentType:'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};
export const url_batchUpload = 'get|placeorder/batchUpload';
export const batchUpload = function (data) {
    return http(Url2(url_batchUpload), data, {
        contentType: 'application/x-www-form-urlencoded',
        timeout: INFINITE
    });
};
export const url_warehouse_channel = "get|delivery/getWarehouseChannel";
export const api_warehouse_channel = function () {
    return http(Url2(url_warehouse_channel));
};

export const url_placeorder_package_statuses = "get|placeorder/:type/statuses";
export const api_placeorder_package_statuses = function (type, data) {
    return http(Url2(url_placeorder_package_statuses, {type: type}), data);
};

export const url_accounts = "get|placeorder/accounts";
export const api_accounts = function (params) {
    return http(Url2(url_accounts), params);
};
export const url_shipment = "post|placeorder/shipping";
export const api_shipment = function (params) {
    return http(Url2(url_shipment), params);
};

//包裹信息
export const url_package = "get|packages/:id";
export const api_get_package = function (id) {
    return http(Url2(url_package, {id: id}));
};

//包裹进度条
export const url_package_speed = "get|packages/:id/speed";
export const api_get_package_speed = function (id) {
    return http(Url2(url_package_speed, {id: id}));
};

//更新包裹信息
export const url_updata_package = "put|packages/:id";
export const api_updata_package = function (id, data) {
    return http(Url2(url_updata_package, {id: id}), data);
};

export const url_push_guanyi = 'put|placeorder/pushGuanyi';
export const api_push_guanyi = function (params) {
    return http(url_push_guanyi, params);
};
export const url_uploadYt = 'put|placeorder/uploadYt';
export const api_uploadYt = function (params) {
    return http(url_uploadYt, params);
};

//获取币种
export const url_get_currency = "get|currency/dictionary";
export const api_get_currency = function (data) {
    return http(Url2(url_get_currency));
};

export const url_reback = "post|placeorder/reback";
export const api_reback = function (data) {
    return http(url_reback, data);
};
//获取平台
export const url_placeorder_channels = "get|placeorder/channels";
export const api_placeorder_channels = function (data) {
    return http(url_placeorder_channels, data);
};
//物流包裹异常>下单异常批量重跑规则providers-exception/batch/running-declare
export const url_providers_exception_batch_running_declare = "post|providers-exception/batch/running-declare";
export const api_providers_exception_batch_running_declare = function (data) {
    return http(url_providers_exception_batch_running_declare, data);
};
//物流包裹异常>导出
export  const  url_providers_exception_export = "post|providers-exception/export";
export const api_providers_exception_export = function (data,head) {
    return http(url_providers_exception_export, data,head);
};
//确认上传
export const url_confirm_upload = "post|placeorder/confirmUpload";
export const api_confirm_upload = function (data) {
    return http(url_confirm_upload, data);
};

// 导出
export const url_place_order_export = "post|placeorder/export";
export const api_place_order_export = function (data) {
    return http(url_place_order_export, data);
};

//lazada物流上传
export const url_place_lazada_upload = "post|placeorder/lazada-upload";
export const api_place_lazada_upload = function (data) {
    return http(url_place_lazada_upload, data);
};

//批量作废
export const url_providers_exception_batch_invalid = "post|providers-exception/batch/invalid";
export const api_providers_exception_batch_invalid = data=> {
    return http(url_providers_exception_batch_invalid, data);
};

//更换包裹号
export const url_providers_exception_batch_change_package = "post|providers-exception/batch/changePackageNumber";
export const api_providers_exception_batch_change_package = data=> {
    return http(url_providers_exception_batch_change_package, data);
};

//异常包裹类型
export const api_package_exception_status = ()=>{
    return http("get|package-exception/status");
};

//包裹异常列表
export const api_package_exception_list = (data)=>{
    return http("get|package-exception",data);
};


//异常包裹导出
export  const  url_package_exception_export = "post|package-exception/export";
export const api_package_exception_export =(data,head) =>{
    return http(url_package_exception_export, data,head);
};

//异常包裹导出标题

export const api_package_exception_title = ()=>{
    return http("get|package-exception/export-title");
};
