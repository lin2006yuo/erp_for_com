/**
 * Created by RondaFul on 2016/11/25.
 */
import {http} from '../lib/http-plus';

export const url_logistics_list = "get|carrier";
export const logistics_list = function (data) {
    return http(Url2(url_logistics_list), data);
};
export const url_logistics_check = "get|carrier/:id";
export const logistics_check = function (id, data) {
    return http(Url2(url_logistics_check, {id: id}), data);
};
export const url_logistics_status = "post|carrier/status";
export const logistics_status = function (data) {
    return http(Url2(url_logistics_status), data);
};
//同步邮寄方式
export const url_logistics_shipping = "post|carrier/down/shipping";
export const logistics_shipping = function (data) {
    return http(Url2(url_logistics_shipping), data);
};
//添加邮寄方式
export const url_add_logistics = "post|shipping-method";
export const api_add_logistics = function (data) {
    return http(Url2(url_add_logistics), data);
};
export const url_logistics_add = "post|carrier";
export const logistics_add = function (data) {
    return http(Url2(url_logistics_add), data);
};
export const url_logistics_update = "put|carrier/:id";
export const logistics_update = function (id, data) {
    return http(Url2(url_logistics_update, {id: id}), data);
};
/*----停用启用*/
export const url_logistics_enabled = "put|shipping-method/:id/status";
export const logistics_enabled = function (id, data) {
    return http(Url2(url_logistics_enabled, {id: id}), data);
};
/*----类型*/
export const url_logistics_type = "get|carrier/index-code";
export const logistics_type = function () {
    return http(Url2(url_logistics_type));
};
//获取物流方式基本信息
export const url_logistics_base = "get|shipping-method/:id";
export const api_base = function (id) {
    return http(Url2(url_logistics_base, {id: id}));
};
//获取面单信息
export const url_logistics_express = "get|shipping-method/label/:id";
export const api_express = function (id) {
    return http(Url2(url_logistics_express, {id: id}));
};
//获取实效运费
export const url_logistics_effective = "get|shipping-method/detail/:id";
export const api_effective = function (id) {
    return http(Url2(url_logistics_effective, {id: id}));
};
//获取可发货平台信息
export const url_logistics_channel = "get|shipping-method/channel/:id";
export const api_logistics_channel = function (id) {
    return http(Url2(url_logistics_channel, {id}));
};
//获取速卖通线上发货地址
export const url_ali_address = "get|ali-address";
export const api_ali_address = function (data) {
    return http(url_ali_address, data);
};

//保存 基本信息
export const url_logistics_base_keep = "put|shipping-method/:id";
export const api_base_keep = function (id, data) {
    return http(Url2(url_logistics_base_keep, {id: id}), data);
};
//保存面单信息
export const url_logistics_express_keep = "put|shipping-method/label/:id";
export const api_express_keep = function (id, data) {
    return http(Url2(url_logistics_express_keep, {id: id}), data);
};

// 修改面单水印信息
export const url_shipping_coordinate_keep = "put|shipping-method/save-coordinate";
export const api_shipping_coordinate_keep = function (data) {
    return http(url_shipping_coordinate_keep, data);
};

//保存实效运费
export const url_logistics_effective_keep = "post|shipping-method/detail/:id";
export const api_effective_keep = function (id, data) {
    return http(Url2(url_logistics_effective_keep, {id: id}), data);
};
//保存可发货平台信息
export const url_logistics_channel_keep = "put|shipping-method/channel/:id";
export const api_logistics_channel_keep = function (id, data) {
    return http(Url2(url_logistics_channel_keep, {id}), data);
};
//获取分区编码
export const url_get_zone = "get|zone";
export const api_get_zone = function () {
    return http(Url2(url_get_zone));
};
//获取分区编码
export const url_get_country = "get|country";
export const api_get_country = function (data) {
    return http(Url2(url_get_country), data);
};
//获取分区编码2 ‘添加国家’ 页面使用
export const url_get_country_list = "get|country/lists";
export const api_get_country_list = function (data) {
    return http(Url2(url_get_country_list), data);
};

//获取币种
export const url_get_currency = "get|packing/getCurrency";
export const api_get_currency = function () {
    return http(Url2(url_get_currency));
};

//excel导入
export const url_shipping_detail = "post|shipping-method/import/detail";
export const api_shipping_detail = function (data) {
    return http(Url2(url_shipping_detail), data);
};

//获取url地址
export const url_shipping_token_url = "get|carrier/wishpost-url";
export const api_shipping_token_url = function (data) {
    return http(Url2(url_shipping_token_url), data);
};
//获取旺集地址 get|carrier/wangjipost-url
export const url_shipping_wangjipost_url = "get|carrier/wangjipost-url";
export const api_shipping_wangjipost_url = function (data) {
    return http(Url2(url_shipping_wangjipost_url), data);
};
//获取物流商面单序列号 carrier/sequence-number
export const url_get_sequence_number = "get|carrier/sequence-number";
export const api_get_sequence_number = function (data) {
    return http(url_get_sequence_number, data);
};
//邮寄方式面单序列号 shipping-method/sequence-number
export const url_shipping_method = "get|shipping-method/sequence-number";
export const api_shipping_method = function (data) {
    return http(url_shipping_method, data);
};
//可合并集包邮寄方式 get|carrier/:id/shiping
export const url_shortname_method = "get|carrier/:id/shipping";
export const api_shortname_method = function (id, data) {
    return http(Url2(url_shortname_method, {id: id}), data);
};

//授权
export const url_wish_authors = "post|carrier/wish-authors";
export const api_wish_authors = function (data) {
    return http(url_wish_authors, data);
};
//旺集授权 post|carrier/wangji-authors
export const url_wangji_authors = "post|carrier/wangji-authors";
export const api_wangji_authors = function (data) {
    return http(url_wangji_authors, data);
};
//邮寄方式日志
export const url_shipping_method_log = "get|shipping-method/log";
export const api_shipping_method_log = function (data) {
    return http(url_shipping_method_log, data);
};
//设置速卖通地址信息
export const url_set_ali_address = "put|shipping-method/ali-address/:id";
export const api_set_ali_address = function (id, data) {
    return http(Url2(url_set_ali_address, {id: id}), data);
};

//复制物流报价信息
export const url_copy_shipping = "post|shipping-method/copy";
export const api_copy_shipping = function (data) {
    return http(url_copy_shipping, data);
};

//获取物流方式列表
export const url_shipping_list = "get|shipping-method/info";
export const api_shipping_list = function () {
    return http(url_shipping_list);
};
//获取拣货单分类列表
export const url_special_list = "get|shipping-method/label-norm-list";
export const api_special_list = function () {
    return http(url_special_list);
};