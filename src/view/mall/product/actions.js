/**
 * Created by wuchuguang on 16-10-26.
 */
import * as status from './product_status';

export default {
    actionLists:[
        {name:'提交',status:1,action:function(selects){
            console.log('action trigger ');
            var select=selects;
        }},
        {name:'作废',status:1,action:function(selects){

        }},
        {name:'审批通过',status:status.waitApproval.status,action:function(selects){
            console.log('审批通过：');
            console.log(selects);
        }},
        {name:'审批未通过',status:status.waitApproval.status,action:function(selects){
            console.log('审批未通过：')
            console.log(selects);
        }},
        {name:'取样中',status:status.waitTask.status,action:function(selects){
            console.log('取样中')
        }},
        {name:'已拍图',status:status.waitGenSku.status,action:function (selects) {
            console.log('已拍图')
        }},
        {name:'待翻译',status:status.gener.status,action:function (selects) {

        }}
    ]
}