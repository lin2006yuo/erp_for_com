/**
 * Created by RondaFul on 2018/5/3.
 */
import {http} from '../lib/http-plus';
//-------------------------------------mymall刊登
// 获取关联信息
export const get_info_data = 'get|publish/pandao/getdata';
export const api_info_data = function (data) {
    return http(get_info_data, data);
}

// 编辑刊登详情
export const url_edit_publish = 'get|publish/pandao/edit/id/:id/status/:status';
export const api_edit_publish = function (data) {
    return http(Url2(url_edit_publish, { id: data.id, status: data.status }))
}
//提交 刊登
export const url_add_publish = 'post|publish/pandao/add';
export const api_add_publish = function (data) {
    return http(url_add_publish, data);
}
//
//提交 刊登
export const url_publish_update = 'post|publish/pandao/update';
export const api_publish_update = function (data) {
    return http(url_publish_update, data);
}