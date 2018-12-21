/**
 * Created by Administrator on 2018/3/17.
 */
import {http} from '../lib/http-plus';
export const url_shelf_report = "get|warehouse/report/shelf";
export const api_shelf_report = function (params) {
    return http(Url2(url_shelf_report), params);
};
