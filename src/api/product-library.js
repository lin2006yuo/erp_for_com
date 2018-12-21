/**
 * Created by RondaFul on 2016/12/6.
 */

import {http} from '../lib/http-plus';
export const url_publish_product = "get|goods";
export const publish_product = function(data) {
    return http(Url2(url_publish_product), data);
};
export const url_publish_status = "post|goods/changeStatus";
export const publish_status= function(data) {
    return http(Url2(url_publish_status), data);
};
export const url_channel = "get|channel";
export const api_channel = function (data) {
   return http(Url2(url_channel),data);
};
export const url_publish_sku = "get|goods/skus/:id";
export const publish_sku = function(id) {
    return http(Url2(url_publish_sku, {id:id}));
};
//查看商品
export const url_publish_baseinfo = "get|goods/base/:id";
export const publish_baseinfo = function(id) {
    return http(Url2(url_publish_baseinfo, {id:id}));
};
export const url_publish_specification = "get|goods/specification/:id";
export const publish_specification = function(id) {
    return http(Url2(url_publish_specification, {id:id}));
};
export const url_publish_updata_supplier = "post|supplier/setDefault";
export const publish_updata_supplier = function(data) {
    return http(Url2(url_publish_updata_supplier), data)
};

export const url_publish_attribute = "get|goods/attribute/:id/edit";
export const publish_attribute  = function(id) {
    return http(Url2(url_publish_attribute , {id:id}));
};
const url_publish_description = "get|goods/description/:id";
export const publish_description  = function(id) {
    return http(Url2(url_publish_description , {id:id}));
};
export const url_publish_supplier = "get|goods/supplier/:id";
export const publish_supplier  = function(id) {
    return http(Url2(url_publish_supplier, {id:id}));
};
export const url_publish_log = "get|goods/log/:id";
export const publish_log  = function(id) {
    return http(Url2(url_publish_log, {id:id}));
};

export const url_publish_quality = "get|goods/qcitems/:id";
export const publish_quality  = function(id) {
    return http(Url2(url_publish_quality , {id:id}));
};
//编辑 下的质检
export const url_publish_edit_quality = "get|goods/qcitems/{id}/edit";
export const publish_edit_quality  = function(id) {
    return http(Url2(url_publish_edit_quality, {id:id}));
};
//编辑下的属性
export const url_edit_attribute = "get|goods/attribute/:id/edit";
export const api_edit_attribute  = function(id) {
    return http(Url2(url_edit_attribute, {id:id}));
};
//查看sku
export const url_publish_skuinfo = "get|goods/skuinfo/:id";
export const publish_skuinfo  = function(id) {
    return http(Url2(url_publish_skuinfo, {id:id}));
};
//保存 sku
export const url_publish_skuinfo_keep = "put|goods/skuinfo/:id";
export const publish_skuinfo_keep  = function(id,data) {
    return http(Url2(url_publish_skuinfo_keep, {id:id}),data);
};
//编辑 sku
export const url_publish_skuinfo_edit = "get|goods/skuinfo/:id/edit";
export const publish_skuinfo_edit  = function(id) {
    return http(Url2(url_publish_skuinfo_edit, {id:id}));
};


//编辑商品的单位
export const url_publish_edit_unit = "get|unit/dictionary";
export const publish_edit_unit  = function() {
    return http(Url2(url_publish_edit_unit));
};
export const url_publish_edit_packing = "get|packing/dictionary";
export const publish_edit_packing  = function() {
    return http(Url2(url_publish_edit_packing));
};
export const url_publish_edit_tag= "get|tag/dictionary";
export const publish_edit_tag  = function() {
    return http(Url2(url_publish_edit_tag));
};
export const url_publish_edit_brand= "get|brand/dictionary";
export const publish_edit_brand  = function() {
    return http(Url2(url_publish_edit_brand));
};
export const url_publish_edit_tort= "get|tort/dictionary";
export const publish_edit_tort  = function() {
    return http(Url2(url_publish_edit_tort));
};
export const url_publish_edit_lang= "get|lang/dictionary";
export const publish_edit_lang= function() {
    return http(Url2(url_publish_edit_lang));
};
/*更新产品描述*/
export const url_update_desc = "put|goodsdev/description/:id";
export const api_update_desc = function (id,data) {
    return http(Url2(url_update_desc,{id:id}),data);
}
export const url_publish_edit_property= "get|goods/transport-property";
export const publish_edit_property= function() {
    return http(Url2(url_publish_edit_property));
};

//保存商品
export const url_publish_updata_baseinfo = "put|goods/base/:id";
export const publish_updata_baseinfo = function(id,data) {
    return http(Url2(url_publish_updata_baseinfo, {id:id}),data);
};
export const url_publish_updata_specification = "put|goods/specification/:id";
export const publish_updata_specification = function(id,data) {
    return http(Url2(url_publish_updata_specification, {id:id}),data );
};
export const url_publish_updata_attribute = "put|goods/attribute/:id";
export const publish_updata_attribute = function(id,data) {
    return http(Url2(url_publish_updata_attribute, {id:id}),data );
};
export const url_publish_updata_description = "put|goods/description/:id";
export const publish_updata_description = function(id,data) {
    return http(Url2(url_publish_updata_description, {id:id}),data );
};
export const url_publish_updata_addlog = "post|goods/log/:id";
export const publish_updata_addlog = function(id,data) {
    return http(Url2(url_publish_updata_addlog, {id:id}),data );
};
export const url_publish_updata_quality = "put|goods/qcitems/:id";
export const publish_updata_quality  = function(id,data) {
    return http(Url2(url_publish_updata_quality , {id:id}),data);
};
//添加商品接口
export const url_publish_add_baseinfo = "post|goods";
export const publish_add_baseinfo = function(data) {
    return http(Url2(url_publish_add_baseinfo), data);
};
//获取所有仓库

export const url_publish_edit_depot= "get|delivery/getWarehouseChannel";
export const publish_edit_depot  = function() {
    return http(Url2(url_publish_edit_depot));
};
export const url_publish_edit_plat= "get|goods/platform-sale-status";
export const publish_edit_plat  = function() {
    return http(Url2(url_publish_edit_plat));
};

export const url_publish_add_plat= "get|goodsdev/platform-sale";
export const publish_add_plat  = function() {
    return http(Url2(url_publish_add_plat));
};

//请求所有图片
export const url_publish_img = "get|goods-image/:id";
export const publish_img  = function(id) {
    return http(Url2(url_publish_img , {id:id}));
};
//上传单个图片
export const url_update_img = "post|goods-image";
export const api_update_img = function(data) {
    return http(Url2(url_update_img), data);
};
export const url_update_excel = "post|goods/import";
export const api_update_excel = function(data) {
    return http(Url2(url_update_excel), data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    })
};
export const url_goods_import_update = "post|goods/importUpdate";
export const api_goods_import_update = function (data) {
    return http(Url2(url_goods_import_update),data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    })
};
//更改SKU状态
export const url_change_sku_status = "post|goods/skuStatus";
export const api_change_sku_status  = function(data) {
    return http(Url2(url_change_sku_status), data);
};

// 获取 开发员
export const url_publish_development = "get|user/development/staffs";
export const api_development  = function() {
    return http(Url2(url_publish_development), {content:""});
};
//获取采购员
export const url_get_purchase = "get|user/purchase/staffs";
export const api_get_purchase = function (data) {
    return http(Url2(url_get_purchase), data);
}
//server 图片
export const url_server_img = "post|goods/download";
export const api_server_img = function (data) {
    return http(url_server_img, data);
}
//获取产品
export const url_server_path = "get|goods-image/path";
export const api_server_path = function (data) {
    return http(url_server_path, data);
}
//渠道映射
export const url_goods_category_map = "put|goods/goodsCategoryMap/:id";
export const api_goods_category_map = function (id,data) {
    return http(Url2(url_goods_category_map,{id:id}),data);
}
//导出joom商品
export const url_export = "get|goods/export";
export const api_export = function (data) {
    return http(url_export,data);
}
//打印sku标签
export const url_get_label = "get|goods/sku-label";
export const api_get_label = function (data) {
    return http(url_get_label,data);
}
//批量抓取图片
export const url_batch_catch_photo = "post|goods/batch-catch-photo";
export const api_batch_catch_photo = function (data) {
    return http(url_batch_catch_photo,data);
}
//导出
export const url_export_sku = "post|goods/export-sku";
export const api_export_sku = function (data) {
    return http(url_export_sku,data);
}
//批量修改采购员goods/set-purchaser
export const url_goods_set_purchaser = "post|goods/set-purchaser";
export const api_goods_set_purchaser = function (data) {
    return http(url_goods_set_purchaser,data);
};
// 获取可供选择的导出字段
export const url_goods_export_field = "get|goods/export-field";
export const api_goods_export_field = function (data) {
    return http(url_goods_export_field,data);
};
// 获取我的模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
// 获取导出模板详情

export const url_goods_export_template_info = "get|export-template/:id";
export const api_goods_export_template_info = function (id,data) {
    return http(Url2(url_goods_export_template_info,{id:id}),data);
};
//保存
export const url_goods_export_template_save = "post|export-template";
export const api_goods_export_template_save = function (data) {
    return http(url_goods_export_template_save,data);
};
//删除模板
export const url_goods_export_template_del = "delete|export-template/:id";
export const api_goods_export_template_del = function (id,data) {
    return http(Url2(url_goods_export_template_del,{id:id}),data);
};
//推送赛盒
export const url_push_irobotbox = "post|goods/batch/push-irobotbox";
export const api_push_irobotbox = function (data) {
    return http(url_push_irobotbox,data);
};
//删除sku
export const url_batch_delete = "post|goods-sku/batch/delete";
export const api_batch_delete = function (data) {
    return http(url_batch_delete,data);
};
//Shopee格式导出
export const url_download_shopee = "post|goods/download/shopee";
export const api_download_shopee = function (data) {
    return http(url_download_shopee,data);
};
//刊登统计
export const url_publish_statistics = "get|goods/publish-statistics/:id";
export const api_publish_statistics = function (id) {
    return http(Url2(url_publish_statistics,{id:id}));
};
//Cdiscount格式导出
export const url_download_discount = "post|goods/download/discount";
export const api_download_discount = function (data) {
    return http(url_download_discount,data);
};
//walmart格式导出
export const url_download_walmart = "post|goods/download/walmart";
export const api_download_walmart = function (data) {
    return http(url_download_walmart,data);
};
//Lazada格式导出
export const url_download_lazada = "post|goods/download/lazada";
export const api_download_lazada = function (data) {
    return http(url_download_lazada,data);
};
// 图片查重-》添加本地图片，获取phash参数
export const url_get_phash = "post|goods/get-phash";
export const api_get_phash = function (data) {
    return http(url_get_phash,data);
};
///goods/export-noon
export const url_export_noon = "post|goods/export-noon";
export const api_export_noon = function (data) {
    return http(url_export_noon,data);
};
//申请商品侵权下架
export const url_post_goods_tort = "post|goods/:id/tort";
export const api_post_goods_tort = function (id,data) {
    return http(Url2(url_post_goods_tort,{id:id}),data);
};
//获取侵权下架的信息
export const url_get_goods_tort = "get|goods/:id/tort";
export const api_get_goods_tort = function (id) {
    return http(Url2(url_get_goods_tort,{id:id}));
};
//推送品连
export const url_distribution_push = "post|goods/distribution-push";
export const api_distribution_push = function (data) {
    return http(url_distribution_push,data);
};



