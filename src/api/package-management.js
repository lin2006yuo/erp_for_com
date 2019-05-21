/**
 * Created by Administrator on 2017/11/21.
 */
import {http} from '../lib/http-plus';
export const url_entrepot_picking = "get|delivery/getWarehouseChannel";
export const entrepot_picking = function(){
    return http(url_entrepot_picking)
};
