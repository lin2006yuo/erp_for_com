
import {http} from "../lib/http-plus";

/*跌价申请（列表）*/
export const url_googs_discount = "get|goods-discount";
export const api_goods_discount = function(data){
    return http(url_googs_discount,data);
};
/*仓库列表*/
export const url_warehouse_list = "get|delivery/getWarehouseChannel";
export const api_warehouse_options = function(data){
    return http(url_warehouse_list,data);
};
/*展示跌价单条的详情*/
export const url_goods_discount_read = "get|goods-discount/:id/read";
export const api_goods_discount_read = function(id){
    return http(Url2(url_goods_discount_read,{id}))
};

/*跌价申请新增*/
export const url_goods_discount_add = "post|goods-discount";
export const api_goods_discount_add = function(data){
    return http(url_goods_discount_add,data);
};

/*跌价申请（修改、审批）*/
export const url_goods_discount_edit = "put|:id/goods-discount";
export const api_goods_discount_edit = function(id,data){
  return http(Url2(url_goods_discount_edit,{id}),data);
};

/*查询 库存价 最后一次采购价 最新报价*/
export const url_goods_discount_price = "get|goods-discount/:id/auto-price/:warehouse/warehouse";
export const api_goods_discount_price = function(id,warehouse){
    return http(Url2(url_goods_discount_price,{id,warehouse}));
};

/*跌价申请(批量审核)   data = {status:'',ids:[]}*/
export const url_goods_discount_batch = "post|goods-discount/batch";
export const api_goods_discount_batch = function(data){
    return http(url_goods_discount_batch,data);
};

/*部分导出 2 , 全部导出 1 data={export_type:1} */
export const url_goods_discount_export = "post|goods-discount/export";
export const api_goods_discount_export = function(data){
    return http(url_goods_discount_export,data);
};

/*批量导入*/
export const url_goods_discount_batch_import = "post|goods-discount/batch-import";
export const api_goods_discount_batch_import = function(data){
    return http(url_goods_discount_batch_import,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};

/*导入模板下载*/
export const url_goods_discount_import_template = "get|goods-discount/import-template";
export const api_goods_discount_import_template = function(data){
    return http(url_goods_discount_import_template,data);
};
