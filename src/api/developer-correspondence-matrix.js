import {http} from '../lib/http-plus';

/* 开发员对应矩阵表格信息列表 */
export const url_developer_list = "get|developer";
export const api_developer_list = function(data){
    return http(url_developer_list,data)
};
/* 开发员options列表 */
export const url_developer = "get|user/development/staffs";
export const api_developer = function(data){
    return http(url_developer,data);
};
/*摄影师options列表 */
export const url_grapher = "get|user/grapher/staffs";
export const api_grapher = function(data){
    return http(url_grapher,data);
};

/*翻译员options列表*/
export const url_translator = "get|user/translator/staffs";
export const api_translator = function(data){
    return http(url_translator,data);
};

/* 语种options列表*/
export const url_lang = "get|lang/dictionary";
export const api_lang = function(data){
    return http(url_lang,data);
};

/*美工组options列表*/
export const url_designer_master = "get|user/designer/groupLeader/leaders";
export const api_designer_master = function(data){
    return http(url_designer_master,data);
};

/*根据id获取当前开发者信息 */
export const url_id_developer = "get|goodsdev/:id/developer";
export const api_id_developer =function(id){
    return http(Url2(url_id_developer,{id:id}));
};

/*批量添加开发者信息*/
export const url_developer_batch_add = "post|developer/batch/add";
export const api_developer_btach_add =function(data){
    return http(url_developer_batch_add,data);
};

/*更新开发者信息*/
export const url_developer_change = "put|developer/:id";
export const api_developer_change = function(id,data){
    return http(Url2(url_developer_change,{id:id}),data);
};

/*删除 开发者信息*/
export const url_developer_delete = "delete|developer/:id";
export const api_developer_delete = function(id,data){
    return http(Url2(url_developer_delete,{id:id}),data);
};
