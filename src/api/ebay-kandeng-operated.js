/**
 * Created by Administrator on 2017/6/25.
 */
/*
 *ebay 刊登操作
 */

import {http} from '../lib/http-plus';

/*1.0批量上架*/
export const url_online_ebay_product = "post|onlineEbayProduct"
export const api_online_ebay_product = function(data){
  return http(url_online_ebay_product,data)
};
/*1.1批量下架*/
export const url_offline_ebay_product = "post|offlineEbayProduct";
export const api_offline_ebay_product = function(data){
  return http(url_offline_ebay_product,data)
};
/*1.2批量修改商品标题*/
export const url_edit_ebay_title = "post|editEbayTitle";
export const api_edit_ebay_title = function(data){
  return http(url_edit_ebay_title,data)
};
/*1.3批量修改商品商品一口价和可售数量*/
export const url_edit_ebay_product_price_quantity = "post|editEbayProductPriceQuantity"
export const api_edit_ebay_product_price_quantity = function(data){
  return http(url_edit_ebay_product_price_quantity,data)
};
/*1.4同步listing*/
export const url_rsync_ebay_product = "post|rsyncEbayProduct"
export const api_rsync_ebay_product = function(data){
  return http(url_rsync_ebay_product,data)
};
/*1.5上传listing*/
export const url_rsync_edit_ebay_product = "post|rsyncEditEbayProduct"
export const api_rsync_edit_ebay_product = function(data){
  return http(url_rsync_edit_ebay_product,data)
};
/*1.6批量修改拍卖价*/
export const url_edit_ebay_product_auction_price = "post|editEbayProductAuctionPrice"
export const api_edit_ebay_product_auction_price = function(data){
  return http(url_edit_ebay_product_auction_price,data)
};
/*1.7批量修改商店分类*/
export const url_edit_ebay_shop_category = "post|ebay/listing-store-category/batch";
export const api_edit_ebay_shop_category = function(data){
  return http(url_edit_ebay_shop_category,data)
};
/*1.8自动补货设置*/
export const url_ebay_replenishment = "post|ebayReplenishment"
export const api_ebay_replenishment = function(data){
  return http(url_ebay_replenishment,data)
};
/*1.9重上规则设置*/
export const url_ebay_reshelf = "post|ebayReshelf"
export const api_ebay_reshelf = function(data){
  return http(url_ebay_reshelf,data)
};
/*获取目录树*/
export const url_custom_category_ree = "get|Publish/Ebay/getCustomCategoryTree"
export const api_custom_category_tree = function(data){
  return http(url_custom_category_ree,data)
};
/*2.3应用公共模块*/
export const url_ebay_common_module = "post|application-ebay-common-module"
export const api_ebay_common_module = function(data){
  return http(url_ebay_common_module,data)
};
/*2.1获取商品相册*/
export const url_get_ebay_product_images = "get|get-ebay-product-images"
export const api_get_ebay_product_images = function(data){
  return http(url_get_ebay_product_images,data)
};
/*2.2修改商品主图和橱窗图片*/
export const url_update_ebay_product_images = "post|update-ebay-product-images"
export const api_update_ebay_product_images = function(data){
  return http(url_update_ebay_product_images,data)
};
/*2.0促销折扣设置*/
export const url_ebay_promotion = "post|ebay-promotion"
export const api_ebay_promotion = function(data){
  return http(url_ebay_promotion,data)
};
/*2.2将listing成本价更改成调整后的成本价*/
export const url_ebay_adjust_price = "put|ebay/adjust-price/batch"
export const api_ebay_adjust_price = function(data){
    return http(url_ebay_adjust_price,data)
};
/*5.批量修改范本店铺分类 */
export const url_draft_store_category = "put|ebay/draft-store-category/batch"
export const api_draft_store_category = function(data){
    return http(url_draft_store_category,data)
};