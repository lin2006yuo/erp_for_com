/**
 * Created by Administrator on 2017/7/19.
 */
import {http} from '../lib/http-plus';
//获取规则列表
export const url_get_pricing_list = "get|pricing-rules";
export const api_get_pricing_list = function(params) {
    return http(Url2(url_get_pricing_list), params);
};

//获取创建人列表
export const url_get_user = "get|user";
export const api_get_user = function(params) {
    return http(Url2(url_get_user), params);
};

//获取定价规则可选条件
export const url_get_pricing_items = "get|pricing-rules/items";
export const api_get_pricing_items = function(id) {
    return http(Url2(url_get_pricing_items));
};

//获取币种
export const url_get_currency = "get|currency/dictionary";
export const api_get_currency = function(data){
    return http(Url2(url_get_currency));
};

//获取定价操作内容
export const url_get_pricing_default = "get|pricing-rules/default";
export const api_get_pricing_default = function(data){
    return http(Url2(url_get_pricing_default));
};

//获取平台信息
export const url_getchannel = "get|orders/channel";
export const api_getchannel = function () {
    return http(Url2(url_getchannel));
};

//获取站点信息
export const url_account_list = "get|orders/account";
export const api_account_list = function(datas){
    return http(url_account_list, datas);
};

export const url_add = "post|pricing-rules";
export const api_add = function(params){
    return http(url_add, params);
};

export const url_modify = "put|pricing-rules/:id";
export const api_modify = function(id, modifys){
    return http(Url2(url_modify,{id}), modifys);
};

export const url_lookup = "get|pricing-rules/:id";
export const api_lookup = function(id){
    return http(Url2(url_lookup,{id}));
};

export const url_delete = "delete|pricing-rules/:id";
export const api_delete = function(id){
    return http(Url2(url_delete,{id}));
};

//启用&&停用规则
export const url_change_status = 'post|pricing-rules/:id/status/:value';
export const api_change_status = function(id, value){
    return http(Url2(url_change_status,{id:id, value:value}));
};

export const url_copy = 'post|pricing-rules/copy';
export const api_copy = function(id, title){
    return http(url_copy, {id,title});
};

//排序保存
export const url_pricing_sort = "post|pricing-rules/sort";
export const api_pricing_sort = function (sorts) {
    return http(Url2(url_pricing_sort), sorts);
};
// /shipping-method/dictionary?warehouse_id=2&country_code=AD
export const url_get_shipping_method = "get|shipping-method/dictionary";
export const api_get_shipping_method = function (data) {
    return http(url_get_shipping_method,data);
};
