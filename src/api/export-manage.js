/**
 * Created by Administrator on 2017/8/7.
 */
import {http} from '../lib/http-plus';

//导出列表查询
export const url_get_export = "get|report/export-files";
export const api_get_export = function (data) {
    return http(Url2(url_get_export), data);
};

//删除
export const url_delete_export = "delete|report/export-files/deletes/:id";
export const api_delete_export = function (id) {
    return http(Url2(url_delete_export,{id:id}));
};