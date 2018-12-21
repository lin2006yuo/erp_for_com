import {http} from '../lib/http-plus';

//Wish物流列表
export const url_wish_carrier = "get|wish-carrier";
export const api_wish_carrier = function (data) {
    return http(url_wish_carrier, data);
};

//添加Wish邮物流
export const url_add_wish_carrier = "post|wish-carrier";
export const api_add_wish_carrier = function (data) {
    return http(url_add_wish_carrier, data);
};

//获取wish物流基本信息
export const url_wish_carrier_info = "get|wish-carrier/:id";
export const api_wish_carrier_info = function (id) {
    return http(Url2(url_wish_carrier_info, {id: id}));
};

//更新wish物流信息
export const url_update_wish_carrier = "put|wish-carrier/:id";
export const api_update_wish_carrier = function (id, data) {
    return http(Url2(url_update_wish_carrier, {id: id}), data);
};

//获取wish邮绑定账号列表
export const url_wish_carrier_account = "get|wish-carrier/:id/account-list";
export const api_wish_carrier_account = function (id) {
    return http(Url2(url_wish_carrier_account, {id: id}));
};

//Wish物流账号绑定接口
export const url_wish_carrier_bind_account = "post|wish-carrier/:id/account-bind";
export const api_wish_carrier_bind_account = function (id, data) {
    return http(Url2(url_wish_carrier_bind_account, {id: id}), data);
};

//Wish物流绑定日志
export const url_wish_carrier_log = "get|wish-carrier/:id/bind-log";
export const api_wish_carrier_log = function (id) {
    return http(Url2(url_wish_carrier_log, {id: id}));
};

//获取等待绑定wish账号
export const url_wish_account = "get|wish-carrier/account";
export const api_wish_account = function () {
    return http(url_wish_account);
};

//wish账号解绑
export const url_unbind_account = "post|wish-carrier/:id/account-unbind";
export const api_unbind_account = function (id, data) {
    return http(Url2(url_unbind_account, {id: id}), data);
};

//wish获取授权码
export const url_wish_get_token = "get|wish-carrier/wishpost-url";
export const api_wish_get_token = function (data) {
    return http(url_wish_get_token, data);
};

//wish授权
export const url_wish_carrier_authors = "post|wish-carrier/wish-authors";
export const api_wish_carrier_authors = function (data) {
    return http(url_wish_carrier_authors, data);
};