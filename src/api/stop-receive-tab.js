import{http} from '../lib/http-plus';

//订单系统-物流异常包裹列表页面>停止揽收获取列表
export const url_get_packages_stop_collecting = "get|packages/stop-collecting";
export const api_get_packages_stop_collecting = function (data) {
    return http(url_get_packages_stop_collecting,data);
};
