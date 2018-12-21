/**
 * Created by Administrator on 2017/7/25.
 */
import {http} from '../lib/http-plus';

export const url_get_goods = "get|goods-pre-dev";
export const api_get_goods =function (data) {
  return http(Url2(url_get_goods),data);
};

export const url_goods_pre_dev = "post|goods-pre-dev";
export const api_goods_pre_dev = function (data) {
  return http(Url2(url_goods_pre_dev),data)
};

export const url_goods_log = "get|goods-pre-dev/log/:id";
export const api_goods_log = function (id) {
    return http(Url2(url_goods_log,{id}));
};

export const url_goods_process = "get|goods-pre-dev/process";
export const api_goods_process = function () {
  return http(Url2(url_goods_process));
};

export const url_read_good = "get|/goods-pre-dev/:id";
export const api_read_good = function (id) {
  return http(Url2(url_read_good,{id}));
};

export const url_proposer = "get|goods-pre-dev/proposer";
export const api_proposer = function () {
  return http(Url2(url_proposer));
};

//获取人员信息
export const url_product_person = "get|user/:type/staffs";
export const api_product_person = function() {
    return http(Url2(url_product_person, {type:'development'}));
};

export const url_get_goods_pre_dev_audit = 'get|goods-pre-dev/audit';
export const api_get_goods_pre_dev_audit = function (data) {
  return http(Url2(url_get_goods_pre_dev_audit),data)
};

export const url_update_goods = 'put|goods-pre-dev/:id';
export const api_update_goods = function (id,data) {
  return http(Url2(url_update_goods,{id}), data);
};

export const url_dispose = 'post|goods-pre-dev/audit';
export const api_dispose = function (data) {
  return http(Url2(url_dispose), data);
};

export const url_img_requirement = 'get|goods/img-requirement';
export const api_img_requirement = function () {
  return http(Url2(url_img_requirement));
};
