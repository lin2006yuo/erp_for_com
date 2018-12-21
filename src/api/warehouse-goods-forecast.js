import {http} from '../lib/http-plus';

//第三方仓库产品预报列表
export const url_forecast_list = "get|warehouse-goods-forecast";
export const api_forecast_list = function (data) {
    return http(url_forecast_list, data);
};
//获取状态列表
export const url_forecast_status = "get|warehouse-goods-forecast/status";
export const api_forecast_status = function () {
    return http(url_forecast_status);
};
//新增产品预报
export const url_add_forecast = "post|warehouse-goods-forecast";
export const api_add_forecast = function (data) {
    return http(url_add_forecast, data);
};
//获取预报品类
export const url_forecast_category = "get|warehouse-goods-forecast/category";
export const api_forecast_category = function (data) {
    return http(url_forecast_category, data);
};
//获取预报品类详情
export const url_forecast_detail = "get|warehouse-goods-forecast/:id";
export const api_forecast_detail = function (id) {
    return http(Url2(url_forecast_detail, {id}));
};
//获取产品信息
export const url_get_goods = "get|warehouse-goods-forecast/get-goods";
export const api_get_goods = function (data) {
    return http(url_get_goods, data);
};
//sku关联
export const url_relate_sku = "post|warehouse-goods-forecast/relate-sku";
export const api_relate_sku = function(data) {
    return http(url_relate_sku, data);
}