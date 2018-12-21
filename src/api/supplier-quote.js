/**
 * Created by user on 2017/1/11.
 */
import {http} from '../lib/http-plus';
//供应商报价列表
export const url_supplier_offer = "get|supplier-offer";
export const api_supplier_offer = function(data){
    return http(url_supplier_offer, data);
};
//新增供应商报价
export const url_add_supplier_offer = "post|supplier-offer";
export const api_add_supplier_offer = function(data){
    return http(url_add_supplier_offer, data);
};
//供应商历史报价
export const url_history_offer = "get|supplier-offer/history";
export const api_history_offer = function(data){
    return http(url_history_offer, data);
};
//获取币种信息
export const url_get_currency = "get|supplier-offer/currency";
export const api_get_currency = function(){
    return http(url_get_currency);
};
//获取仓库信息
export const url_get_warehouse = "get|supplier-offer/warehouse";
export const api_get_warehouse = function(data){
    return http(url_get_warehouse,data);
};
//添加货品
export const url_add_goods = "get|orders/getGoods";
export const api_add_goods = function(data){
    return http(url_add_goods,data);
};
//获取分类列表
export const url_get_categories = "get|categories";
export const api_get_categories = function(){
    return http(url_get_categories);
};
//审核报价
export const url_change_states = "post|supplier-offer/status";
export const api_change_states = function(data){
    return http(url_change_states, data);
};
//获取编辑供应商报价信息

export const url_edit_supplier = "get|supplier-offer/:id/edit";
export const api_edit_supplier = function(id){
    return http(Url2(url_edit_supplier,{id:id}));
};
//更新供应商报价信息
export const url_update_supplier = "put|supplier-offer/:id";
export const api_update_supplier = function(id,data){
    return http(Url2(url_edit_supplier,{id:id}),data);
};
//获取供应商信息
export const url_get_supplier = "get|supplier-offer/supplier";
export const api_get_supplier = function(data){
    return http(url_get_supplier,data);
};

//获取品牌
export const url_get_brand = "get|supplier-offer/brand";
export const api_get_brand = function(){
    return http(url_get_brand);
};
//获取采购员
export const url_get_buyer = "get|user/buyer/staffs";
export const api_get_buyer = function(data){
    return http(url_get_buyer,data);
};

//获取当前报价
export const url_get_current = "get|supplier-offer/current";
export const api_get_current = function(data){
    return http(url_get_current,data);
};
//搜索商品

export const url_get_goods_sku = "get|supplier-offer/getGoodsSkus";
export const api_get_goods_sku = function(data){
    return http(url_get_goods_sku,data);
};
//根据供应商获取商品列表
export const url_get_goods_supper = "get|supplier-offer/getSupplierSkus";
export const api_get_goods_supp = function(data){
    return http(url_get_goods_supper,data);
};

//获取goods_id对应的供应商
export const url_egt_sup = "get|goods/getGoodSupplierList";
export const api_get_sup = function(data){
    return http(url_egt_sup,data);
};
//根据供应商id获取供应商
export const url_get_suppliers = "get|supplier/getSuppliersInfo";
export const api_get_sups = function(data){
    return http(url_get_suppliers,data);
};
//导入报价
export const url_import_suppliers = "post|supplier-offer/import";
export const api_import_suppliers = function(data){
    return http(url_import_suppliers,data);
};

//导出报价
export const url_export_supplier = "get|supplier-offer/export";
export const api_export_supplier = function(data){
    return http(url_export_supplier,data);
};
//获取币种列表
export const url_get_currency_select_list = "get|currency";
export const api_get_currency_select_list = function(){
    return http(url_get_currency_select_list);
};
