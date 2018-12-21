/**
 * Created by Administrator on 2017/8/5.
 */
import {http} from '../lib/http-plus';
// 获取买家列表
export const url_buyers_list = 'get|buyers';
export const api_buyers_list = function(data){
  return http(url_buyers_list, data);
};
// 获取编辑买家信息
export const url_buyers = 'get|buyers/:id/edit';
export const api_buyers = function(id){
  return http(Url2(url_buyers,{id:id}));
};
// 获取编辑地址信息
export const url_addresses = 'get|buyer-addresses';
export const api_addresses = function(data){
  return http(url_addresses,data);
};
// 更新买家信息
export const url_update_buyers = 'put|buyers/:id';
export const api_update_buyers = function(id,data){
  return http(Url2(url_update_buyers,{id:id}),data);
};
// 更新地址信息
export const url_update_addresses = 'put|buyer-addresses/:id';
export const api_update_addresses = function(id,data){
  return http(Url2(url_update_addresses,{id:id}),data);
};
// 删除
export const url_delete_buyers = 'delete|buyers/:id';
export const api_delete_buyers = function(id){
  return http(Url2(url_delete_buyers,{id:id}));
};
// 删除地址
export const url_delete_addresses = 'delete|buyer-addresses/:id';
export const api_delete_addresses = function(id){
  return http(Url2(url_delete_addresses,{id:id}));
};
// 批量删除
export const url_delete_buyers_batch = 'post|buyers/batch/delete';
export const api_delete_buyers_batch = function(data){
  return http(url_delete_buyers_batch,data);
};
// 批量导入
export const url_buyer_batch_import = 'post|buyers/batch-update';
export const api_buyer_batch_import = function(data){
    return http(url_buyer_batch_import,data,{
        contentType:'application/x-www-form-urlencoded',
        timeout:INFINITE
    });
};

//获取导入模板
export const url_get_import_template = "get|buyers/update-template";
export const api_get_import_template = function (data) {
    return http(url_get_import_template, data);
};

// 添加买家信息
export const url_add_buyers = 'post|buyers';
export const api_add_buyers = function(data){
  return http(url_add_buyers, data);
};
// 添加买家地址信息
export const url_add_addresses = 'post|buyer-addresses';
export const api_add_addresses = function(data){
  return http(url_add_addresses, data);
};
// 设置默认地址
export const url_buyer_addresses = 'post|buyer-addresses/default';
export const api_buyer_addresses = function(data){
  return http(url_buyer_addresses, data);
};
/*获取国家代码*/
export const url_get_countrys = "get|country";
export const api_get_countrys = function () {
    return http(url_get_countrys);
}
