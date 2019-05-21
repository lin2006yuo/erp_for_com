import {http} from '../lib/http-plus';
//添加物流价格模板
export const url_add_template = "post|publish/wish-express/add-template";
export const api_add_template = function (data) {
    return http(url_add_template,data)
};

//编辑物流价格模板
export const url_edit_template = "post|publish/wish-express/edit-template";
export const api_edit_template = function (data) {
    return http(url_edit_template,data)
};

//获取物流价格模板列表
export const url_get_express_list = "get|publish/wish-express/lists";
export const api_get_express_list = function (data) {
    return http(url_get_express_list,data)
};

//删除物流价格模板
export const url_del_batch = "delete|publish/wish-express/batch-delete";
export const api_del_batch = function (data) {
    return http(url_del_batch,data)
};

//获取单条物流价格模板详情
export const url_wish_express_detail = "get|publish/wish-express/detail";
export const api_wish_express_detail = function (data) {
    return http(url_wish_express_detail,data)
}
