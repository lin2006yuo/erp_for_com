/**
 * Created by RondaFul on 2017/5/9.
 */
import {http} from '../lib/http-plus';
//------------------------------------                                    -速卖通刊登
//获取 已刊登 列表
export const url_aliexpress_list = "get|publish/express/product";
export const api_aliexpress_list = function(data) {
    return http(url_aliexpress_list, data);
};
//获取 草稿箱列表
export const url_aliexpress_list_drafts = "get|publish/express/drafts";
export const api_aliexpress_list_drafts = function(data) {
    return http(url_aliexpress_list_drafts, data);
};
//获取待刊登列表
export const url_aliexpress_list_wait = "get|publish/express/wait-publish";
export const api_aliexpress_list_wait = function(data) {
    return http(url_aliexpress_list_wait, data);
};
//获取刊登异常列表
export const url_aliexpress_list_fail = "get|publish/express/fail-publish";
export const api_aliexpress_list_fail = function(data) {
    return http(url_aliexpress_list_fail, data);
};


//获取用户 速卖通
export const url_aliexpress_account = "get|member-ship/4/sales/publish";
export const api_aliexpress_account = function(data) {
    return http(Url2(url_aliexpress_account), data);
};

//获取用户 速卖通（未刊登）
export const url_express_get_accounts = "get|aliexpress-accounts";
export const api_express_get_accounts = function(data) {
    return http(url_express_get_accounts,data);
};


//获取用户 ebay
export const url_ebay_account = "get|member-ship/1/sales/publish";
export const api_ebay_account = function(data) {
    return http(Url2(url_ebay_account), data);
};

//获取未刊登数据
export const url_aliexpress_no_list = "get|publish/express/unpublish";
export const api_aliexpress_no_list = function(data) {
    return http(Url2(url_aliexpress_no_list), data);
};
//获取产品分类
export const url_aliexpress_classify = "get|publish/express/categorys";
export const api_aliexpress_classify = function(data) {
    return http(Url2(url_aliexpress_classify), data);
};
//获取基础信息
export const url_aliexpress_base_info = "get|publish/express/productInfo";
export const api_aliexpress_base_info = function(data) {
    return http(Url2(url_aliexpress_base_info), data);
};
//获取销售员
export const url_aliexpress_seller = "get|publish/express/sellers";
export const api_aliexpress_seller = function() {
    return http(Url2(url_aliexpress_seller));
};
//获取仓库
export const url_aliexpress_depot = "get|publish/express/warehouses";
export const api_aliexpress_depot = function() {
    return http(Url2(url_aliexpress_depot));
};
//获取运费模板
export const url_aliexpress_template = "get|publish/express/freightTemp";
export const api_aliexpress_template = function(data) {
    return http(Url2(url_aliexpress_template),data);
};
//获取服务模板
export const url_aliexpress_service_template = "get|publish/express/promiseTemp";
export const api_aliexpress_service_template = function(data) {
    return http(Url2(url_aliexpress_service_template),data);
};
//获取商品分组
export const url_aliexpress_team = "get|publish/express/groups";
export const api_aliexpress_team = function(data) {
    return http(Url2(url_aliexpress_team),data);
};
//判断该商户是否拥有该分类产品对应的速卖通分类权限
export const url_aliexpress_permission = "get|publish/express/categoryPermission";
export const api_aliexpress_permission = function(data) {
    return http(Url2(url_aliexpress_permission),data);
};
//获取 sku
export const url_aliexpress_sku = "get|publish/express/pulishData";
export const api_aliexpress_sku = function(data) {
    return http(Url2(url_aliexpress_sku),data);
};
//获取图片
export const url_aliexpress_image = "get|publish/express/images";
export const api_aliexpress_image = function(data) {
    return http(Url2(url_aliexpress_image),data);
};
//刊登
export const url_aliexpress_puslish = "post|publish/express/publish";
export const api_aliexpress_puslish = function(data) {
    return http(Url2(url_aliexpress_puslish),data);
};
//保存草稿
export const url_publish_express_save_draft = "post|publish/express/save-draft";
export const api_publish_express_save_draft = function(data) {
    return http(url_publish_express_save_draft,data);
};
//通过sku获取listing数据
export const url_aliexpress_sku_listing = "get|publish/express/skuInfo";
export const api_aliexpress_sku_listing = function(data) {
    return http(Url2(url_aliexpress_sku_listing),data);
};
//获取产品计数单位
export const url_aliexpress_productUnit = "get|publish/express/productUnit";
export const api_aliexpress_productUnit = function() {
    return http(Url2(url_aliexpress_productUnit));
};
//根据平台账号 分类 获取尺码模板
export const url_aliexpress_sizeTemp = "get|publish/express/sizeTemp";
export const api_aliexpress_sizeTemp = function(data) {
    return http(Url2(url_aliexpress_sizeTemp),data);
};
//获取平台状态
export const url_aliexpress_product_status = "get|publish/express/productStatus";
export const api_aliexpress_product_status = function() {
    return http(Url2(url_aliexpress_product_status));
};
//到期时间下拉数据
export const url_aliexpress_expire_search = "get|publish/express/expireSearch";
export const api_aliexpress_expire_search = function() {
    return http(Url2(url_aliexpress_expire_search));
};
//违禁词检测
export const url_aliexpress_prohibited = "post|publish/express/prohibited";
export const api_aliexpress_prohibited = function(data) {
    return http(Url2(url_aliexpress_prohibited),data);
};
//获取编辑刊登商品
export const url_aliexpress_edit_product = "get|publish/express/editProduct";
export const api_aliexpress_edit_product = function(data) {
    return http(Url2(url_aliexpress_edit_product),data);
};

// 复制
export const url_aliexpress_copy_product = "get|publish/express/copy";
export const api_aliexpress_copy_product = function(data) {
    return http(Url2(url_aliexpress_copy_product),data);
};

//获取分类品牌
export const url_aliexpress_brand = "get|publish/express/brands";
export const api_aliexpress_brand = function(data) {
    return http(Url2(url_aliexpress_brand),data);
};
//获取管理产品信息模板
export const url_aliexpress_relation = "get|publish/express/:id/relation/productTemp";
export const api_aliexpress_relation = function(id) {
    return http(Url2(url_aliexpress_relation, {id:id}));
};
//获取自定义信息模板
export const url_aliexpress_custom = "get|publish/express/:id/custom/productTemp";
export const api_aliexpress_custom = function(id) {
    return http(Url2(url_aliexpress_custom, {id:id}));
};

//批量操作
//批量操作 修改标题、服务模板、运费模板、毛重
export const url_aliexpress_batch_product = "post|publish/express/batchProduct";
export const api_aliexpress_batch_product = function(data) {
    return http(Url2(url_aliexpress_batch_product),data);
};
//批量修改尺寸
export const url_aliexpress_batch_size = "post|publish/express/batchSize";
export const api_aliexpress_batch_size = function(data) {
    return http(Url2(url_aliexpress_batch_size),data);
};
//批量修改计数单位
export const url_aliexpress_batch_unit = "post|publish/express/batchUnit";
export const api_aliexpress_batch_unit= function(data) {
    return http(Url2(url_aliexpress_batch_unit),data);
};
//批量修改sku价格
// export const url_aliexpress_batch_price = "post|publish/express/batchPrice";
// export const api_aliexpress_batch_price= function(data) {
//     return http(Url2(url_aliexpress_batch_price),data);
// };
export const url_aliexpress_batch_price = "post|editAePrice";
export const api_aliexpress_batch_price= function(data) {
    return http(Url2(url_aliexpress_batch_price),data);
};

//修改可售数量
export const url_edit_ae_stock = "post|editAeStock";
export const api_edit_ae_stock = function (data) {
    return http(Url2(url_edit_ae_stock), data);
}

// 批量上架
export const url_aliexpress_batch_online = "post|onlineAeProduct";
export const api_aliexpress_batch_online= function(data) {
    return http(Url2(url_aliexpress_batch_online),data);
};
//批量下架
export const url_aliexpress_batch_offline = "post|offlineAeProduct";
export const api_aliexpress_batch_offline= function(data) {
    return http(Url2(url_aliexpress_batch_offline),data);
};
//批量修改分组
export const url_aliexpress_batch_group = "post|editAeGroupId";
export const api_aliexpress_batch_group= function(data) {
    return http(Url2(url_aliexpress_batch_group),data);
};
//批量修改发货期
export const url_aliexpress_batch_delivery = "post|editAeDeliveryTime";
export const api_aliexpress_batch_delivery= function(data) {
    return http(Url2(url_aliexpress_batch_delivery),data);
};
//批量延长有效期
export const url_aliexpress_batch_eff = "post|editAeWsValidNum";
export const api_aliexpress_batch_eff= function(data) {
    return http(Url2(url_aliexpress_batch_eff),data);
};
//批量删除
export const url_aliexpress_batch_del = "delete|publish/express/batchDelete";
export const api_aliexpress_batch_del= function(data) {
    return http(Url2(url_aliexpress_batch_del),data);
};
//获取刊登销售员
export const url_aliexpress_sale = "get|member-ship/sales/member";
export const api_aliexpress_sale = function(data) {
    return http(Url2(url_aliexpress_sale), data);
};
//获取列表销售员
export const url_aliexpress_sale_list = "get|orders/account";
export const api_aliexpress_sale_list = function(data) {
    return http(Url2(url_aliexpress_sale_list),data);
};
//同步listing
export const url_aliexpress_rsync = "post|rsyncAeProduct";
export const api_aliexpress_rsync = function(data) {
    return http(Url2(url_aliexpress_rsync), data);
};
//上传listing
export const url_aliexpress_rsync_update = "post|rsyncEditAeProduct";
export const api_aliexpress_rsync_update = function(data) {
    return http(Url2(url_aliexpress_rsync_update), data);
};
//导出为小平台按钮
export const url_aliexpress_output_format = "post|publish/express/download";
export const api_aliexpress_output_format = function (data) {
    return http(Url2(url_aliexpress_output_format), data);
};
//获取所有品牌
export const url_ali_brand = "get|ali-brand/brands";
export const api_ali_brand = function(data) {
    return http(Url2(url_ali_brand),data);
};
//保存品牌设置
export const url_ali_brand_set = "post|ali-brand/set-brands";
export const api_ali_brand_set = function(data) {
    return http(Url2(url_ali_brand_set),data);
};

//获取最新品牌
export const url_ali_brand_new = "post|ali-brand/syn-brands";
export const api_ali_brand_new= function(data) {
    return http(Url2(url_ali_brand_new),data);
};
//获取账号下的模板
export const url_ali_custom_template = "get|get-relation-and-custom-template";
export const api_ali_custom_template= function(data) {
    return http(url_ali_custom_template,data);
};
//保存账号下的模板
export const url_ali_custom_template_keep = "post|editAeTemlate";
export const api_ali_custom_template_keep= function(data) {
    return http(url_ali_custom_template_keep,data);
};
//计算 参考价格
export const url_ref_price = "post|pricing-rules/calculate";
export const api_ref_price= function(data) {
    return http(url_ref_price,data);
};
//listing产品图片
export const url_ali_listing_img = "get|goods-image/listing";
export const api_ali_listing_img= function(data) {
    return http(url_ali_listing_img,data);
};
// 上传自定义图片
export const url_ali_listing_img_self_up = "post|goods-image/self-image";
export const api_ali_listing_img_self_up= function(data) {
    return http(url_ali_listing_img_self_up,data);
};
// 获取自定义图片列表
export const url_ali_listing_img_self = "get|goods-image/self-image";
export const api_ali_listing_img_self= function(data) {
    return http(url_ali_listing_img_self,data);
};
// 获取自定义图片列表
export const url_logs = "get|listing/aliexpress/logs";
export const api_logs= function(data) {
    return http(url_logs,data);
};
// 速卖通平台分类列表
export const url_aliexpress_categories = "get|publish/express/aliexpress-categories";
export const api_aliexpress_categories= function(data) {
    return http(url_aliexpress_categories,data);
};

// 速卖通平台根据品牌获取分类
export const url_aliexpress_categories_brand = "get|publish/express/aliexpress-get-categories-by-brand";
export const api_aliexpress_categories_brand= function(data) {
    return http(url_aliexpress_categories_brand,data);
};

// 保存速卖通刊登分类属性
export const url_ali_save_publish_template = "post|aliexpress-save-publish-template";
export const api_ali_save_publish_template= function(data) {
    return http(url_ali_save_publish_template,data);
};

// 速卖通刊登获取相似商品
export const url_get_same_spu = "get|listing/aliexpress/getSameSpu";
export const api_get_same_spu= function(data) {
    return http(url_get_same_spu,data);
};

// 速卖通刊登获取商品属性
export const url_get_same_spu_attr = "get|listing/aliexpress/get-same-spu-Attribute";
export const api_get_same_spu_attr= function(data) {
    return http(url_get_same_spu_attr,data);
};

// 速卖通刊获取分类信息
export const url_get_same_spu_cate = "get|listing/aliexpress/get-same-spu-category";
export const api_get_same_spu_cate= function(data) {
    return http(url_get_same_spu_cate,data);
};

// 速卖通刊获取产品分组
export const url_rsync_aliexpress_groups = "get|rsync-aliexpress-groups";
export const api_rsync_aliexpress_groups= function(data) {
    return http(url_rsync_aliexpress_groups,data);
};

// 速卖通刊获取运费模板
export const url_rsync_aliexpress_transport = "get|rsync-aliexpress-transport";
export const api_rsync_aliexpress_transport= function(data) {
    return http(url_rsync_aliexpress_transport,data);
};

// 速卖通刊同步服务模板
export const url_rsync_aliexpress_promise = "get|rsync-aliexpress-promise";
export const api_rsync_aliexpress_promise= function(data) {
    return http(url_rsync_aliexpress_promise,data);
};

// 热词可用语言列表
export const url_alihel_hotlang = "get|alihelp-hotlang";
export const api_alihel_hotlang= function(data) {
    return http(url_alihel_hotlang,data);
};

// 热词
export const url_alihelp_hot_word = "post|alihelp-hot";
export const api_alihelp_hot_word= function(data) {
    return http(url_alihelp_hot_word,data);
};

// 直通车
export const url_alihelp_bcar = "post|alihelp-bcar";
export const api_alihelp_bcar= function(data) {
    return http(url_alihelp_bcar,data);
};

// 获取分类
export const url_aliexpress_category = "get|aliexpress-auth-local-category";
export const api_aliexpress_category= function(data) {
    return http(url_aliexpress_category,data);
};

//批量更改成本价
export const url_get_change_cost_price = "get|publish/express/change-cost-price";
export const api_get_change_cost_price = function(data){
    return http(url_get_change_cost_price,data);
};
//批量复制listing数据
export const url_post_publish_express_batch_copy = "post|publish/express/batch-copy";
export const api_post_publish_express_batch_copy= function(data) {
    return http(url_post_publish_express_batch_copy,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:120000
    });
};
//计算刊登定价
export const url_pricing_rules = 'post|pricing-rules/calculate';
export const api_pricing_rules = function (data) {
    return http(url_pricing_rules,data);
};
//添加区域分组
export const url_publish_express_add_region_group = 'post|publish/express/add-region-group';
export const api_publish_express_add_region_group = function (data) {
    return http(url_publish_express_add_region_group,data);
};
//编辑区域分组
export const url_publish_express_edit_region_group = 'post|publish/express/edit-region-group';
export const api_publish_express_edit_region_group = function (data) {
    return http(url_publish_express_edit_region_group,data);
};
//删除区域分组
export const url_publish_express_delete_region_group = 'post|publish/express/delete-region-group';
export const api_publish_express_delete_region_group = function (data) {
    return http(url_publish_express_delete_region_group,data);
};
//获取区域分组选择列表
export const url_get_publish_express_region_group = "get|publish/express/region-group";
export const api_get_publish_express_region_group = function(){
    return http(url_get_publish_express_region_group);
};
//获取区域模板选择列表
export const url_get_publish_express_region_template = "get|publish/express/region-template";
export const api_get_publish_express_region_template = function(data){
    return http(url_get_publish_express_region_template,data);
};
//添加区域分组
export const url_publish_express_add_region_template = 'post|publish/express/add-region-template';
export const api_publish_express_add_region_template = function (data) {
    return http(url_publish_express_add_region_template,data);
};
//删除区域模板
export const url_publish_express_delete_region_template = "post|publish/express/delete-region-template";
export const api_publish_express_delete_region_template = function(data){
    return http(url_publish_express_delete_region_template,data);
};
//更新区域模板
export const url_publish_express_edit_region_template = "post|publish/express/edit-region-template";
export const api_publish_express_edit_region_template = function(data){
    return http(url_publish_express_edit_region_template,data);
};
//精确获取模板
export const url_get_publish_express_region_template_info = "get|publish/express/region-template-info";
export const api_get_publish_express_region_template_info = function(data){
    return http(url_get_publish_express_region_template_info,data);
};
//批量提交刊登
export const url_publish_express_batch_add_fail_publish = "post|publish/express/batch-add-fail-publish";
export const api_publish_express_batch_add_fail_publish = function(data){
    return http(url_publish_express_batch_add_fail_publish,data);
};
