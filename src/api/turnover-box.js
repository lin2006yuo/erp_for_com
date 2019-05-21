/**
 * Created by Administrator on 2017/11/14.
 */
import {http} from '../lib/http-plus';

export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function(){
    return http(url_entrepot_picking)
};

//获取周转箱列表
export const url_get_turnover = "get|turnover-box";
export const api_get_turnover = function(data){
    return http(Url2(url_get_turnover),data);
};

//新增周转箱
export const url_add_turnover = "post|turnover-box";
export const api_add_turnover = function(data){
    return http(Url2(url_add_turnover),data);
};

//作废周转箱
export const url_invalid_turnover = "put|turnover-box/:id/invalid";
export const api_invalid_turnover = function(id){
    return http(Url2(url_invalid_turnover,{id:id}));
};

//操作日志
export const url_logs_turnover = "get|turnover-box/:id/logs";
export const api_logs_turnover = function(id,data){
    return http(Url2(url_logs_turnover,{id:id}),data);
};

//打印
export const url_print_turnover = "get|/turnover-box/print";
export const api_print_turnover = function(data){
    return http(Url2(url_print_turnover),data);
};
//批量释放
export const url_batch_remove = "post|turnover-box/batch-remove";
export const api_batch_remove = function(data){
    return http(Url2(url_batch_remove),data);
};