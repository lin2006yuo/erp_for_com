/**
 * Created by Administrator on 2017/12/21.
 */
import {http} from '../lib/http-plus';
export const url_reback_shelves = "get|return-wait-shelf";
export const api_reback_shelves = function(data){
    return http(url_reback_shelves,data);
};

//旧退回待上架列表
export const url_reback_shelves_old_list = "get|reback-shelves";
export const api_reback_shelves_old_list = function(data){
    return http(url_reback_shelves_old_list,data);
};


export const url_reback_shelves_batch = "post|reback-shelves/batch/save";
export const api_reback_shelves_batch = function(data){
    return http(url_reback_shelves_batch,data);
};

//列表详情点击
export const url_get_single_detail = "get|return-wait-shelf/:id/detail";
export const api_get_single_detail = (id,data)=> {
    return http(Url2(url_get_single_detail, {id:id}),data);
};

//列表上架
export const url_change_into_grounding = "post|return-wait-shelf/batch/save";
export const api_change_into_grounding = data=> {
    return http(url_change_into_grounding, data);
};