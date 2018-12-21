/**
 * Created by Administrator on 2017/12/16.
 */
import {http} from '../lib/http-plus';

//获取本地仓库存列表
export const url_local = "get|warehouse-goods/local";
export const api_local = function(data){
    return http(url_local,data);
};
//获取库存货位详情接口
export const url_local_detail = "get|warehouse-goods/:id/detail";
export const api_local_detail = function(id){
    return http(Url2(url_local_detail,{id:id}));
};
//商品移库
export const url_local_shif = "post|warehouse-cargo-goods/shift";
export const api_local_shif = function(data){
    return http(url_local_shif,data);
};
//获取仓库货位列表接口
export const url_warehouse_cargo_lists = "get|warehouse-cargo/lists";
export const warehouse_cargo_lists = function(data){
    return http(url_warehouse_cargo_lists,data);
};
//导入货位接口
export const url_warehouse_goods_init = "post|warehouse-goods/init";
export const api_warehouse_goods_init = function(data){
    return http(url_warehouse_goods_init,data);
};
//导入采购库存接口
export const url_warehouse_goods_purchase_in = "post|warehouse-goods/purchase-in";
export const api_warehouse_goods_purchase_in = function(data){
    return http(url_warehouse_goods_purchase_in,data);
};

// 冻结库存 post|warehouse-cargo-goods/auto-bind
export const url_warehouse_goods_modify_hold = "post|warehouse-cargo-goods/modify-hold";
export const api_warehouse_goods_modify_hold = function(data){
    return http(url_warehouse_goods_modify_hold,data);
};

// 待发库存明细
export const url_shipping_detail = "get|warehouse-goods/shipping_detail";
export const api_shipping_detail = function (data) {
    return http(url_shipping_detail, data);
};

//货位记录
export const url_cagro_log = "get|warehouse-goods/cargo-log";
export const api_cagro_log = function (data) {
    return http(url_cagro_log, data);
}