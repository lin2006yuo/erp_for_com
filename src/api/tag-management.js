import{http} from '../lib/http-plus';

//标签列表
export const url_get_tags="get|department-tag";
export const api_get_tags=function (data) {
    return http(url_get_tags,data);
};

//添加标签
export const url_add_tag="post|department-tag";
export const api_add_tag=function (data) {
    return http(url_add_tag,data);
};
//获取单个标签信息
export const url_get_tag_info="get|department-tag/:id";
export const api_get_tag_info=function (id) {
    return http(Url2(url_get_tag_info,{id:id}),);
};
// 修改标签
export const url_edit_tag="put|department-tag/:id";
export const api_edit_tag=function (id,data) {
    return http(Url2(url_edit_tag,{id:id}),data);
};
//删除单个标签
export const url_delete_tag="delete|department-tag/:id";
export const api_delete_tag=function (id) {
    return http(Url2(url_delete_tag,{id:id}));
};
// 根据标签名称、状态搜索
export const url_search_tag="get|department-tag/search";
export const api_search_tag=function (data) {
    return http(url_search_tag,data);
};
