/**
 * Created by RondaFul on 2016/11/14.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

export const url_account_ebay = "get|ebay-account";
export const account_ebay = function(data) {
    return http(url_account_ebay, data);
};
export const url_account_ebay_look = "get|ebay-account/:id";
export const account_ebay_look = function(id) {
    return http(Url2(url_account_ebay_look, {id:id}));
};

export const url_account_ebay_edit = "get|ebay-account/:id/edit";
export const account_ebay_edit = function(id) {
    return http(Url2(url_account_ebay_edit, {id:id}));
};

export const url_account_ebay_authorize = "post|ebay-account/getEbaySessionId";
export const account_ebay_authorize = function(data) {
    return http(url_account_ebay_authorize, data);
};

export const url_account_ebay_token = "post|ebay-account/getFetchEbayToken";
export const account_ebay_token = function(data) {
    return http(url_account_ebay_token, data);
};

export const url_account_ebay_paypal = "get|paypal-account";
export const account_ebay_paypal= function(data) {
    return http(url_account_ebay_paypal, data);
};

export const url_account_ebay_addform = "post|ebay-account";
export const account_ebay_addform = function(data) {
    return http(url_account_ebay_addform, data);
};

export const url_account_ebay_status =  "post|ebay-account/status";
export const account_ebay_status = function(data) {
    return http(url_account_ebay_status, data);
};

export const url_account_ebay_mypay = "post|ebay-account/ebayMapPaypal";
export const account_ebay_mypay = function(data) {
    return http(url_account_ebay_mypay, data);
};

export const url_account_ebay_updata = "put|ebay-account/:id";
export const account_ebay_updata = function(id,data) {
    return http(Url2(url_account_ebay_updata, {id:id}),data);
};

export const url_account_ebay_edit_paypal = "get|ebay-account/mapPaypal/view";
export const api_account_ebay_edit_paypal= function(data) {
    return http(url_account_ebay_edit_paypal, data);
};

export const url_down_ebay_account = "get|ebay-account/down";
export const api_down_ebay_account= function(data) {
    return http(url_down_ebay_account, data);
};
//获取通知列表
export const url_getevent_ebay_account = "get|ebay-account/getevent";
export const api_getevent_ebay_account= function(data) {
    return http(url_getevent_ebay_account, data);
};
//获取通知列表
export const url_setevent_ebay_account = "post|ebay-account/setevent";
export const api_setevent_ebay_account= function(data) {
    return http(url_setevent_ebay_account, data);
};
//获取通知列表
export const url_set_ebay_account = "post|ebay-account/set";
export const api_set_ebay_account= function(data) {
    return http(url_set_ebay_account, data);
};
//oAuth授权
export const url_account_ebay_oauth = "get|ebay-account/:account_id/oauth-login";
export const account_ebay_oauth = function(account_id) {
    return http(Url2(url_account_ebay_oauth, {account_id:account_id}));
};
//获取并保存OAuth Token
export const url_account_oauth_token = "post|ebay-account/:account_id/oauth-token";
export const account_oauth_token = function(account_id,data) {
    return http(Url2(url_account_oauth_token, {account_id:account_id}),data,{contentType:'application/x-www-form-urlencoded', timeout:INFINITE});
};
