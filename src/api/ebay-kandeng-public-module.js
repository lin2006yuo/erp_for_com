/**
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';
/*
 *ebay 公用模块接口
 */
/*保存公用模板*/
export const url_save_common_model = "post|Publish/EbayCommon/saveCommonModel";
export const api_save_common_model = function (data) {
    return http(url_save_common_model,data);
};
/*获取公共模块信息*/
export const url_edit_model = "post|Publish/EbayCommon/editCommonMode";
export const api_edit_model = function (data) {
    return http(url_edit_model,data);
};
/*删除公共模板信息*/
export const url_delete_model ="post|Publish/EbayCommon/removeCommonMode";
export const api_delete_model = function (data) {
    return http(url_delete_model,data);
};

/*添加物流方式*/
export const url_save_common_trans ="post|Publish/EbayCommon/saveCommonTrans";
export const api_save_common_trans = function (data) {
    return http(url_save_common_trans,data);
};

/*获取物流详细信息*/
export const url_get_trans = "post|Publish/EbayCommon/editCommonTrans";
export const api_get_trans = function (data) {
    return http(url_get_trans,data);
};

/*删除物流*/
export const url_delete_trans = "post|Publish/EbayCommon/removeTrans";
export const api_delete_trans = function (data) {
    return http(url_delete_trans,data);
};
/*获取公共模板列表*/
export const url_common_modeList = "post|Publish/EbayCommon/getCommonModeList";
export const api_common_modeList = function (data) {
    return http(url_common_modeList,data);
};
/*获取促销设置模块列表*/
export const url_get_promotionList = "get|/Publish/EbayCommon/getPromotionList";
export const api_get_promotionList = function (data) {
    return http(url_get_promotionList,data);
};
/*模块组合列表*/
export const url_get_combList = "get|Publish/EbayCommon/getCombList";
export const api_get_combList = function (data) {
    return http(url_get_combList,data);
};
/*模块组合保存*/
export const url_save_combList = "post|Publish/EbayCommon/saveComb";
export const api_save_combList = function (data) {
    return http(url_save_combList,data);
};
/*模块组合编辑*/
export const url_edit_combList = "get|Publish/EbayCommon/editComb";
export const api_edit_combList = function (data) {
    return http(url_edit_combList,data);
};
/*模块组合删除*/
export const url_delete_combList = "get|Publish/EbayCommon/removeComb";
export const api_delete_combList = function (data) {
    return http(url_delete_combList,data);
};

/*自定义分类列表*/
export const url_get_cateList =  "get|Publish/EbayCommon/getCateList";
export const api_get_cateList = function (data) {
    return http(url_get_cateList,data);
};
/*自定义分类保存*/
export const url_save_cateList =  "post|Publish/EbayCommon/saveCate";
export const api_save_cateList = function (data) {
    return http(url_save_cateList,data);
};
/*自定义分类编辑*/
export const url_edit_cateList =  "get|Publish/EbayCommon/editCate";
export const api_edit_cateList = function (data) {
    return http(url_edit_cateList,data);
};
/*自定义分类删除*/
export const url_delete_cateList =  "get|Publish/EbayCommon/removeCate";
export const api_delete_cateList = function (data) {
    return http(url_delete_cateList,data);
};


/*Ebay刊登(基础信息) 1.1获取Ebay商品类目*/
export const url_get_categorys = "post|Publish/Ebay/getCategorys";
export const api_get_categorys = function (data) {
    return http(url_get_categorys,data);
};
/*根据关键词查询ebay商户类目 废弃*/
export const url_get_Category_Keyword = "get|Publish/Ebay/getCategoryByKeyword";
export const api_get_Category_Keyword = function (data) {
    return http(url_get_Category_Keyword,data);
};
/*Ebay刊登(基础信息) 1.2获取Ebay商品类目属性*/
export const url_get_specifics = "post|Publish/Ebay/getSpecifics";
export const api_get_specifics = function (data) {
  return http(url_get_specifics,data);
};
/*Ebay刊登(基础信息) 1.3获取Ebay站点*/
export const url_get_ebay_site = "get|Publish/Ebay/getSite";
export const api_get_ebay_site = function () {
    return http(url_get_ebay_site);
};
/*Ebay刊登(基础信息) 1.4获取Ebay账号自定义类目*/
export const url_get_custom_category = "post|Publish/Ebay/getCustomCategory";
export const api_get_custom_category = function (data) {
  return http(url_get_custom_category,data);
};
/*Ebay刊登(基础信息) 1.5获取Ebay物流方式*/
export const url_get_transform = "post|Publish/Ebay/getTrans";
export const api_get_transform = function (data) {
    return http(url_get_transform,data);
};
/*Ebay刊登(基础信息) 1.7获取Ebay国家代码*/
export const url_get_countrys = "get|Publish/Ebay/getCountrys";
export const api_get_countrys = function () {
    return http(url_get_countrys);
};
/*Ebay刊登(基础信息) 1.8获取Ebay国家代码*/
export const url_get_locations = "get|Publish/Ebay/getEbayLocations";
export const api_get_locations = function () {
    return http(url_get_locations);
};
/*1.7获取Ebay销售账号*/
export const url_get_account = "get|Publish/Ebay/getAccounts";
export const api_get_account = function (data) {
    return http(url_get_account,data);
};
/*Ebay刊登(基础信息) 1.8获取Ebay增值税选项*/
export const url_get_vat_info = "get|Publish/Ebay/getVatInfo";
export const api_get_vat_info = function (data) {
  return http(url_get_vat_info,data);
};
/*Ebay刊登(基础信息) 1.9获取Ebay刊登分类历史记录*/
export const url_get_history_category = "post|Publish/Ebay/getHistoryCategory";
export const api_get_history_category = function (data) {
  return http(url_get_history_category,data);
};
/*1.9 获取Ebay商户类目树*/

export const url_get_store_category = "get|Publish/Ebay/getCategoryTree";
export const api_get_store_category = function (data) {
    return http(url_get_store_category ,data);
};
/*1.10获取Ebay备货时间*/
export const url_get_dispatch_time_max =  "get|Publish/Ebay/getDispatchTimeMax";
export const api_get_dispatch_time_max = function (data) {
    return http(url_get_dispatch_time_max,data);
};
/*1.12获取Ebay 退货时间*/
export const url_get_within =  "get|Publish/Ebay/getWithin";
export const api_get_within = function (data) {
    return http(url_get_within,data);
};
/*同步促销规则*/
export const url_rsync_ebay_promotion =  "post|rsync-ebay-promotion";
export const api_rsync_ebay_promotion = function (data) {
    return http(url_rsync_ebay_promotion,data);
};

/*
 *模块组合接口
 */

/*添加组合模块*/
export const url_save_model_cmd = "post|Publish/EbayCommon/saveModelCmb";
export const api_save_model_cmd = function (data) {
    return http(url_save_model_cmd,data);
};



/*
 *刊登列表
 */

/*未刊登*/
export const url_get_unpublished = "get|ebay-unpublished";
export const api_get_unpublished = function (data) {
    return http(url_get_unpublished,data);
};
/*Ebay刊登(基础信息) 1.10 添加Listing页面*/
export const url_add_listing = "post|Publish/EbayListing/addListing";
export const api_add_listing = function (data) {
  return  http(url_add_listing,data,{
      contentType:'application/x-www-form-urlencoded',
      timeout:INFINITE
  });
};
/*Ebay刊登(基础信息) 1.11保存listing信息*/
export const url_save_listing = "post|Publish/EbayListing/saveListing";
export const api_save_listing = function (data) {
  return  http(url_save_listing,data,{
      contentType:'application/x-www-form-urlencoded',
      timeout:INFINITE
  });
};
/*1.12获取Listing列表*/
export const url_listing_management = "post|Publish/EbayListing/listingManagement";
export const api_listing_management = function (data) {
  return  http(url_listing_management,data);
};
/*1.11获取Ebay Paypal账号*/
export const url_get_paypals = "get|Publish/Ebay/getPaypals";
export const api_get_paypals = function (data) {
  return  http(url_get_paypals,data);
};
/*1.16获取Listing编辑页面*/
export const url_edit_listing = "get|Publish/EbayListing/editListing";
export const api_edit_listing = function (data) {
  return  http(url_edit_listing,data,{
      contentType:'application/x-www-form-urlencoded',
      timeout:INFINITE
  });
};
/*1.20批量操作listing列表*/
export const url_update_listing = "post|Publish/EbayListing/updateListingStatus";
export const api_update_listing = function (data) {
  return  http(url_update_listing,data);
};

/*复制范本创建listing*/
export const url_c_listing_byDraft = "get|Publish/EbayListing/cListingByDraft";
export const api_c_listing_byDraft = function (data) {
    return  http(url_c_listing_byDraft,data);
};
//复制范本创建范本
export const url_c_draft_byDraft = "get|Publish/EbayListing/cDraftByDraft";
export const api_c_draft_byDraft = function (data) {
    return  http(url_c_draft_byDraft,data);
};
/*促销列表*/
export const url_get_promotion_list = "get|Publish/EbayCommon/getPromotionList";
export const api_get_promotion_list = function (data) {
  return  http(url_get_promotion_list,data);
};
/*促销保存*/
export const url_save_promotion = "post|Publish/EbayCommon/savePromotion";
export const api_save_promotion = function (data) {
    return  http(url_save_promotion,data);
};
/*促销编辑*/
export const url_edit_promotion = "get|Publish/EbayCommon/editPromotion";
export const api_edit_promotion = function (data) {
    return  http(url_edit_promotion,data);
};
/*促销删除*/
export const url_delete_promotion = "get|Publish/EbayCommon/removePromotion";
export const api_delete_promotion = function (data) {
    return  http(url_delete_promotion,data);
};
/*刊登风格列表*/
export const url_get_stylelist = "get|Publish/EbayCommon/getStyleList";
export const api_get_stylelist = function (data) {
    return http(url_get_stylelist,data);
};
/*刊登风格保存*/
export const url_save_stylelist = "post|Publish/EbayCommon/saveStyle";
export const api_save_stylelist = function (data) {
    return http(url_save_stylelist,data);
};
/*刊登风格编辑*/
export const url_edit_stylelist = "get|Publish/EbayCommon/editStyle";
export const api_edit_stylelist = function (data) {
    return http(url_edit_stylelist,data);
};
/*刊登风格删除*/
export const url_delete_stylelist = "get|Publish/EbayCommon/removeStyle";
export const api_delete_stylelist = function (data) {
    return http(url_delete_stylelist,data);
};

/*1.21 批量重上listing*/
export const url_bulk_heavy_listing = "get|Publish/EbayListing/bulkHeavyListing";
export const api_bulk_heavy_listing = function(data){
  return http(url_bulk_heavy_listing,data);
};
/*获取listing的刊登费用*/
export const url_get_listing_fee = "post|Publish/EbayListing/getListingFee";
export const api_get_listing_fee = function (data) {
    return http(url_get_listing_fee,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    })
}
/* 1.23 获取listing范本列表 */
export const url_get_draft_list = "get|Publish/EbayListing/getDraftList";
export const api_get_draft_list = function(data){
  return http(url_get_draft_list,data,{
      contentType:'application/x-www-form-urlencoded',
      timeout:INFINITE
  });
};
/* 1.24 复制范本创建listing*/
export const url_c_listing_by_draft = "get|Publish/EbayListing/cListingByDraft";
export const api_c_listing_by_draft = function(data){
  return http(url_c_listing_by_draft,data)
};
/* 1.25 获取范本刊登费用*/
export const url_check_draft_fee = "get|Publish/EbayListing/checkDraftFee";
export const api_check_draft_fee = function(data){
  return http(url_check_draft_fee,data);
};
/*批量获取范本刊登费用*/
export const url_testfees_batch = "get|Publish/testfees/batch";
export const api_testfees_batch = function(data){
    return http(url_testfees_batch,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};
/* 1.26 修改范本分类*/
export const url_up_draft_cate = "post|Publish/EbayListing/upDraftCate";
export const api_up_draft_cate = function(data){
  return http(url_up_draft_cate,data);
};
/* 1.27 保存定时规则*/
export const url_save_timing_rule = "post|Publish/EbayListing/saveTimingRule";
export const api_save_timing_rule = function(data){
  return http(url_save_timing_rule,data);
};
/* 1.28 获取定时规则*/
export const url_get_timing_rule_list = "get|Publish/EbayListing/getTimingRuleList";
export const api_get_timing_rule_list = function(data){
  return http(url_get_timing_rule_list,data,{
      contentType:'application/x-www-form-urlencoded',
      timeout:INFINITE
  });
};
/* 1.29 删除定时规则*/
export const url_remove_timing_rule_list = "get|Publish/EbayListing/removeTimingRuleList";
export const api_remove_timing_rule_list = function(data){
  return http(url_remove_timing_rule_list,data);
};
/*复制刊登*/
export const url_copy_published  = "get|Publish/EbayListing/cListingByListing";
export const api_copy_published = function(data){
    return http(url_copy_published,data);
};
/*范本编辑  刊登到平台接口*/
export const url_cDraft_listing  = "post|Publish/EbayListing/updateListing";
export const api_cDraft_listing = function(data) {
    return http(url_cDraft_listing,data);
};
/*范本编辑  刊登到平台接口*/
export const url_getDraft_imgs  = "get|Publish/EbayListing/getDraftImgs";
export const api_getDraft_imgs = function(data) {
    return http(url_getDraft_imgs,data);
};
/*范本编辑  刊登到平台接口*/
export const url_upDraft_imgs  = "post|Publish/EbayListing/upDraftImgs";
export const api_upDraft_imgs = function(data) {
    return http(url_upDraft_imgs,data);
};
/*1.39 批量修改Listing的库存与价格*/
export const url_up_price_qty  = "post|Publish/EbayListing/upPriceQty";
export const api_up_price_qty = function(data) {
    return http(url_up_price_qty,data);
};
/*1.40批量修改Listing的拍卖价格*/
export const url_up_chinese_price  = "post|Publish/EbayListing/upChinesePrice";
export const api_up_chinese_price = function(data) {
    return http(url_up_chinese_price,data);
};
/*1.41批量修改Listing的刊登标题*/
export const url_up_title  = "post|Publish/EbayListing/upTitle";
export const api_up_title = function(data) {
    return http(url_up_title,data);
};
/*1.42批量下架Listing*/
export const url_end_items  = "post|Publish/EbayListing/endItems";
export const api_end_items = function(data) {
    return http(url_end_items,data);
};
/*1.43 批量修改Listing的商店分类*/
export const url_up_store  = "post|Publish/EbayListing/upStore";
export const api_up_store = function(data) {
    return http(url_up_store,data);
};
/*1.43 批量修改Listing的公共模块*/
export const url_up_conmon_mod  = "post|Publish/EbayListing/upConmonMod";
export const api_up_conmon_mod = function(data) {
    return http(url_up_conmon_mod,data);
};
/*1.44 批量修改Listing的橱窗图片*/
export const url_up_images  = "post|Publish/EbayListing/upImages";
export const api_up_images = function(data) {
    return http(url_up_images,data);
};
/*1.46.获取Listing的修改记录*/
export const url_get_action_logs  = "get|Publish/EbayListing/getActionLogs";
export const api_get_action_logs = function(data) {
    return http(url_get_action_logs,data);
};
/*1.48 */
export const url_get_relatedProduc = 'post|Publish/EbayListing/relatedProduc';
export const api_get_relatedProduc = function (data) {
    return http(url_get_relatedProduc,data);
}
/*参考售价*/
export const url_pricing_rules = 'post|pricing-rules/calculate';
export const api_pricing_rules = function (data) {
    return http(url_pricing_rules,data);
}
/*批量修改范本销售账号*/
export const url_up_accounts = 'put|Publish/EbayListing/up-accounts';
export const api_up_accounts = function (data) {
    return http(url_up_accounts,data);
}
/*http://api.rondaful.com/Publish/EbayListing/up-draftitle	*/
export const url_up_draftitle = 'put|Publish/EbayListing/up-draftitle';
export const api_up_draftitle = function (data) {
    return http(url_up_draftitle,data);
}
/*获得修改多属性范本*/
export const url_get_drfspecifics = 'get|Publish/ebay-listing/drfspecifics';
export const api_get_drfspecifics = function (data) {
    return http(url_get_drfspecifics,data);
}
/*批量修改多属性范本*/
export const url_up_specifics = 'put|Publish/EbayListing/up-specifics';
export const api_up_specifics = function (data) {
    return http(url_up_specifics,data);
}
/*批量修改出售方式*/
export const url_draf_listingtype = 'put|Publish/ebay-listing/draf-listingtype';
export const api_draf_listingtype = function (data) {
    return http(url_draf_listingtype,data);
}
/*通过Item ID获取在线listing信息 Publish/ebay/listing-info-byitemid*/
export const url_get_by_itemid = 'get|Publish/ebay/listing-info-byitemid';
export const api_get_by_itemid = function (data) {
    return http(url_get_by_itemid,data);
}
/*立即刊登  提交数据 */
export const url_publish_immediately_save = 'post|Publish/ebay-listing/publish-immediately-save';
export const api_publish_immediately_save = function (data) {
    return http(url_publish_immediately_save,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
}
/*立即刊登*/
export const url_publish_immediately = 'get|Publish/ebay-listing/publish-immediately';
export const api_publish_immediately = function (data) {
    return http(url_publish_immediately,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
}
/*获取刊登数据*/
export const url_get_immediately_results = 'get|Publish/ebay-listing/publish-immediately-results';
export const api_get_immediately_results = function (data) {
    return http(url_get_immediately_results,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
}
/*1.24 获取listing子产品列表*/
export const url_ebay_variations = 'get|Publish/ebay-listing/variations';
export const api_ebay_variations = function (data) {
    return http(url_ebay_variations,data);
}

/*1.58 获取OE兼容信息*/
export const url_ebay_oe_sync = 'get|Publish/ebay/oe-sync';
export const api_ebay_oe_sync = function (data) {
    return http(url_ebay_oe_sync,data);
}

/*1.59 OE管理-新增*/
export const url_ebay_oe_save = 'post|Publish/ebay/oe-save';
export const api_ebay_oe_save = function (data) {
    return http(url_ebay_oe_save,data);
}

/*1.60 OE管理-更新*/
export const url_ebay_oe_update = 'post|Publish/ebay/oe-update';
export const api_ebay_oe_update = function (data) {
    return http(url_ebay_oe_update,data);
}

/*1.61 OE管理-列表*/
export const url_ebay_oe_list = 'get|Publish/ebay/oe-list';
export const api_ebay_oe_list = function (data) {
    return http(url_ebay_oe_list,data);
}

/*1.62 OE管理-编辑*/
export const url_ebay_oe_edit = 'get|Publish/ebay/oe-edit';
export const api_ebay_oe_edit = function (data) {
    return http(url_ebay_oe_edit,data);
}

/*1.63 OE管理-删除*/
export const url_ebay_oe_remove = 'get|Publish/ebay/oe-remove';
export const api_ebay_oe_remove = function (data) {
    return http(url_ebay_oe_remove,data);
}

/*1.64 OE管理-获取车型详细信息*/
export const url_ebay_oe_vechile = 'get|Publish/ebay/oe-vechile';
export const api_ebay_oe_vechile = function (data) {
    return http(url_ebay_oe_vechile,data);
}

/*1.65 OE管理-获取车型品牌*/
export const url_ebay_oe_makes = 'get|Publish/ebay/oe-makes';
export const api_ebay_oe_makes = function (data) {
    return http(url_ebay_oe_makes,data);
}
//立即重上
export const url_relist_itm = "get|Publish/ebay-listing/relist-itm";
export const api_relist_itm = function(data){
    return http(url_relist_itm, data);
};

//立即重上
export const url_oe_model_merge = "post|Publish/ebay/oe-modelmerge";
export const api_oe_model_merge = function(data){
    return http(url_oe_model_merge, data);
};
//同步账号店铺信息
export const url_sync_store = "get|Publish/ebay/sync-store";
export const api_sync_store = function(data){
    return http(url_sync_store, data);
};
//1.44 批量修改Listing的刊登天数
export const url_up_listing_duration = "post|Publish/ebay-listing/up-listing-duration";
export const api_up_listing_duration = function(data){
    return http(url_up_listing_duration, data);
};
//批量修改范本名称（获取数据）
export const url_pre_up_draftname = "get|Publish/EbayListing/preUpDraftname";
export const api_pre_up_draftname = function(data){
    return http(url_pre_up_draftname, data);
};
//批量修改范本名称（提交修改）
export const url_up_draftname = "put|Publish/EbayListing/upDraftname";
export const api_up_draftname = function(data){
    return http(url_up_draftname, data);
};
//导出范本
export const url_export_draft_info = "get|Publish/EbayListing/exportDraftInfo";
export const api_export_draft_info = function(data){
    return http(url_export_draft_info,data);
};
//导出范本
export const url_import_draft_info = "post|Publish/EbayListing/importDraftInfo";
export const api_import_draft_info = function(data){
    return http(url_import_draft_info,data);
};
//导出范本
export const url_share_draft = "post|Publish/EbayListing/shareDraft";
export const api_share_draft = function(data){
    return http(url_share_draft,data);
};
//刷新 运输方式
export const url_batch_sync = 'post|Publish/trans/sync';
export const api_batch_sync = function (data) {
    return http(url_batch_sync,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};
//获取范本/listing店铺分类
export const url_dl_store_category = 'get|ebay/dl-store-category/batch';
export const api_dl_store_category = function (data) {
    return http(url_dl_store_category,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};
//获取店铺分类名称链
export const url_category_chain = 'get|ebay/store-category-chain/:account_id/:store_category_id';
export const api_category_chain = function (account_id,store_category_id) {
    return http(Url2(url_category_chain,{account_id:account_id,store_category_id:store_category_id}));
};
//批量转站点 /ebay/change-site/batch
export const batch_change_site = 'post|ebay/change-site/batch';
export const api_batch_change_site = function (data) {
    return http(batch_change_site,data);
};

/*批量修改范本拍卖刊登天数*/
export const url_ebay_d_chinese_listing_duration = "put|ebay/d-chinese-listing-duration/batch";
export const api_ebay_d_chinese_listing_duration = function(data){
    return http(url_ebay_d_chinese_listing_duration,data)
};
/*关键词搜索 */
export const url_suggested_categories = "get|ebay/suggested-categories";
export const api_suggested_categories = function(data){
    return http(url_suggested_categories,data)
};
/*eBay小语种翻译*/
export const url_translate_batch = "post|ebay/translate/batch";
export const api_translate_batch = function(data){
    return http(url_translate_batch,data)
};
/*范本标题批量随机排序*/
export const url_draft_title_random = "put|publish/ebay/draft-title/random";
export const api_draft_title_random = function(data){
    return http(url_draft_title_random,data)
};