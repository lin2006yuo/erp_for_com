/**
 * Created by Administrator on 2016/10/29.
 */

import {http} from '../lib/http-plus';

export const url_get_express_list = "get|publish/wish-express/lists";
export const api_get_express_list = function (data) {
    return http(url_get_express_list,data)
};
export const url_wish_express_detail = "get|publish/wish-express/detail";
export const api_wish_express_detail = function (data) {
    return http(url_wish_express_detail,data)
}
/*----------wish刊登列表*/
// 获取未刊登
export const url__wish_list = "get|publish/wish/productList"
export const get_product_list = function(data){
  return http(url__wish_list, data);
};
//获取草稿箱
export const url_wish_list_draft = "get|publish/wish/draft"
export const api_wish_list_draft = function(data){
    return http(url_wish_list_draft, data);
};
//获取 wish刊登信息
export const url__wish_getData = "get|publish/wish/getData"
export const api_product_getData = function(data){
  return http(url__wish_getData, data);
};

//获取销售员
export const url_wish_channel = "get|publish/wish/getSellers"
export const api_wish_channel = function(data){
  return http(url_wish_channel, data,{contentType:'application/x-www-form-urlencoded', timeout:60000});
};

//获取刊登图片
export const url_wish_pic = "get|publish/wish/gallery"
export const api_wish_pic = function(data){
  return http(url_wish_pic, data);
};

//保存
export const url_wish_save = "post|publish/wish/save"
export const api_wish_save = function(data){
  return http(url_wish_save, data);
};
//批量保存为草稿箱
export const url_wish_saveMany = "post|publish/wish/saveMany";
export const api_wish_saveMany = function(data){
    return http(url_wish_saveMany, data);
};
//保存并同步
export const url_wish_rsync = "post|publish/wish/rsync"
export const api_wish_rsync = function(data){
  return http(url_wish_rsync, data);
};

//刊登
export const url_wish_add = "post|publish/wish/add"
export const api_wish_add = function(data){
  return http(url_wish_add, data,{
      contentType:'application/x-www-form-urlencoded',
      timeout:INFINITE
  });
};

/*-------------end*/
//获取待刊登列表
export const url__wish_wait_list = "get|publish/wish/waitUpload"
export const api__wish_wait_list = function(data){
  return http(url__wish_wait_list, data);
};

//获取已刊登列表
export const url__wish_all_list = "get|publish/wish/lists"
export const api__wish_all_list = function(data){
  return http(url__wish_all_list, data);
};

//获取定时刊登列表
export const url__wish_time_list = "get|publish/wish/cronUpload"
export const api__wish_time_list = function(data){
  return http(url__wish_time_list, data);
};

//操作按钮
// 更新
export const url__wish_update = "post|listing/wish/updateListing"
export const api__wish_update = function(data){
  return http(url__wish_update, data,{
      contentType:'application/x-www-form-urlencoded',
      timeout:INFINITE
  });
};

// express 设置
export const url_wish_express = "get|listing/wish/getShipping"
export const api_wish_express = function(data){
  return http(url_wish_express, data);
};

//express 保存
export const url_wish_express_save = "post|listing/wish/updateMultiShipping"
export const api_wish_express_save = function(data){
  return http(url_wish_express_save, data);
};

//保存并上传
export const url_wish_express_save_now = "post|listing/wish/updateMultiShippingRightNow"
export const api_wish_express_save_now = function(data){
  return http(url_wish_express_save_now, data);
};

//上传本地图片
export const url_wish_image = "post|publish/wish/uploadImages"
export const api_wish_image = function(data){
  return http(url_wish_image, data);
};

//上传网络图片
export const url_wish_image_web = "post|publish/wish/createNetImage"
export const api_wish_image_web = function(data){
  return http(url_wish_image_web, data);
};

//获取wish size
export const url_wish_size = "get|publish/wish/getWishSize"
export const api_wish_size = function(data){
  return http(url_wish_size, data);
};

//获取joom size
export const url_joom_size = "get|joomattr/size";
export const api_joom_size = function(data){
    return http(url_joom_size, data);
};

//获取wish 颜色
export const url_wish_color = "get|publish/wish/colors"
export const api_wish_color = function(){
  return http(url_wish_color);
};

//获取tags标签
export const url_wish_tags = "get|publish/wish/getWishOnlineTags";
export const api_wish_tags = function(data){
  return http(url_wish_tags, data);
};
// joom tags
export const url_joom_tags = 'get|joomtag-search';
export const api_joom_tags = function (data) {
    return http(url_joom_tags, data)
}

//商品上架
export const url_wish_enable = "post|listing/wish/enable"
export const api_wish_enable = function(data){
  return http(url_wish_enable, data);
};

//商品下架
export const url_wish_disable = "post|listing/wish/disable"
export const api_wish_disable = function(data){
  return http(url_wish_disable, data);
};

//商品sku下架
export const url_wish_disable_sku = "post|listing/wish/disableVariant"
export const api_wish_disable_sku = function(data){
  return http(url_wish_disable_sku, data);
};

//商品sku上架
export const url_wish_enable_sku = "post|listing/wish/enableVariant"
export const api_wish_enable_sku = function(data){
  return http(url_wish_enable_sku, data);
};

//商品批量上架
export const url_wish_enable_batch = "post|listing/wish/batchEnable"
export const api_wish_enable_batch = function(data){
  return http(url_wish_enable_batch, data);
};

//商品批量下架
export const url_wish_disable_batch = "post|listing/wish/batchDisable"
export const api_wish_disable_batch = function(data){
  return http(url_wish_disable_batch, data);
};

//批量下架sku
export const url_wish_disable_batch_sku = "post|listing/wish/batchDisableVariant"
export const api_wish_disable_batch_sku = function(data){
  return http(url_wish_disable_batch_sku, data);
};

//批量上架sku
export const url_wish_enable_batch_sku = "post|listing/wish/batchEnableVariant"
export const api_wish_enable_batch_sku = function(data){
  return http(url_wish_enable_batch_sku, data);
};

//同步listing
export const url_wish_rsynclisting = "post|listing/wish/rsyncListing"
export const api_wish_rsynclisting = function(data){
  return http(url_wish_rsynclisting, data);
};
//同步listing选择按钮
export const url_wish_rsyncNowListing = "post|listing/wish/rsyncNowListing";
export const api_wish_rsyncNowListing = function (data) {
    return http(url_wish_rsyncNowListing,data)
}
//批量刊登
export const url_wish_batch_edit = "post|listing/wish/batchEditAction"
export const api_wish_batch_edit = function(data){
  return http(url_wish_batch_edit, data);
};

//-----刊登listing添加商品接口
export const url_wish_goodsToSpu = "get|goods/goodsToSpu"
export const api_wish_goodsToSpu = function(data){
  return http(url_wish_goodsToSpu, data);
};

//删除 spu
export const url_wish_del = "post|publish/wish/del"
export const api_wish_del = function(data){
  return http(url_wish_del, data);
};

//从产品 刊登
export const url_wish_product_save = "post|publish/wish/addMany";
export const api_wish_product_save = function(data){
  return http(url_wish_product_save, data);
};

// 更新资料
export const url_wish_editrsynclisting = "post|listing/wish/rsyncEditListing"
export const api_wish_editrsynclisting = function(data){
  return http(url_wish_editrsynclisting, data);
};
//草稿箱删除
export const url_wish_del_draft = "post|publish/wish/deleteDraft"
export const api_wish_del_draft = function(data){
    return http(url_wish_del_draft, data);
};
//
export const url_sku_relation = "post|update-sku-relation"
export const api_sku_relation = function(data){
    return http(url_sku_relation, data);
};
//获取操作日志
export const url_wish_action_log = "get|listing/wish/logs"
export const api_wish_action_log = function(data){
    return http(url_wish_action_log, data);
};
//批量导出
export const url_publish_wish_export = "get|publish/wish/export";
export const api_publish_wish_export = function(data){
    return http(url_publish_wish_export, data);
};

//批量获取WE
export const url_get_wish_expressData = "get|listing/wish/getWishExpressData";
export const api_get_wish_expressData = function(data){
    return http(url_get_wish_expressData, data);
};
//批量保存
export const url_setting_wish_express = "post|batch-setting-wish-express";
export const api_setting_wish_express = function(data){
    return http(url_setting_wish_express, data);
};
//批量销售员
export const url_get_wish_users = "get|publish/wish/wishUsers";
export const api_get_wish_users = function(data){
    return http(url_get_wish_users, data);
};
//批量下架sku   /listing/wish/batchDisableVariant
export const url_batch_disable_variant = "post|listing/wish/batchDisableVariant";
export const api_batch_disable_variant = function(data){
    return http(url_batch_disable_variant, data);
};
//批量关闭WE
export const url_batch_close_we = "post|disable-wish-express";
export const api_batch_close_we = function(data){
    return http(url_batch_close_we, data);
};
//获取导出可选字段
export const url_publish_export_fields = "get|publish-export-fields";
export const api_publish_export_fields = function(data){
    return http(url_publish_export_fields, data);
};
//可选字段部分导出
export const url_publish_export = "post|publish-export";
export const api_publish_export = function(data){
    return http(url_publish_export, data);
};
//可选字段全部导出
export const url_publish_export_all = "post|publish-export-all";
export const api_publish_export_all = function(data){
    return http(url_publish_export_all, data);
};
//获取开发人员
export const url_get_user_development_staffs = "get|user/development/staffs";
export const api_get_user_development_staffs = function(){
    return http(url_get_user_development_staffs);
};
//批量更改成本价
export const url_get_change_cost_price = "get|publish/express/change-cost-price";
export const api_get_change_cost_price = function(data){
    return http(url_get_change_cost_price,data);
};
//批量更改价格
export const url_adjust_cost_batch = "put|wish/adjust-cost/batch";
export const api_adjust_cost_batch = function(data){
    return http(url_adjust_cost_batch,data);
};
//获取本地搜索字段
export const url_kangdeng_local = "get|publish/wish/getWishOnlineTags";
export const api_kangdeng_local = function(data){
    return http(url_kangdeng_local,data);
};

