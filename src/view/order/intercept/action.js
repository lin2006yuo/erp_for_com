/**
 * Created by RondaFul on 2016/11/2.
 */

import {url_order_hold_look,url_order_hold_batch,api_order_hold_batch} from "../../../api/order-intercept";
export const operateList = [
    {label:"查看",value:"2",api:url_order_hold_look,action:function(row){
        this.lookVisble = true;
        this.lookId = row.id;
        this.orderNumber = row.order_number;
    }},
    {label:"取消拦截",value:"3",api:url_order_hold_batch,action:function(row){
        this.$prompt('您确定取消拦截已勾选的包裹吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /.{1,}/,
            inputPlaceholder:'取消拦截原因（必填）',
            inputErrorMessage: '取消拦截原因不能为空'
        }).then(({ value }) => {
            let arr = [];
            arr.push(row.id);
            let data = {
                ids:arr,
                status:3,
                comment:value,
            };
            this.hold_batch(data);
        }).catch(() => {
        });
    }},
];
