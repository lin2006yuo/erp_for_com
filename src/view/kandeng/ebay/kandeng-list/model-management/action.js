/**
 * Created by RondaFul on 2016/11/2.
 */

import {api_update_listing,url_update_listing,url_save_listing} from '../../../../../api/ebay-kandeng-public-module';
export const operateList = [
    {label:"编辑",value:"2",api:url_save_listing,action:function(row){
        let params={id:row.id,goods_id:row.goods_id,isAdd:false,isCopy:false,isTemplate:true,isCopyListing:false,curPage:'model'};
        this.$open('/add-listing',params)
    }},
    // {label:"转移",value:"3",action:function(row){
    // }},
    // {label:"复制",value:"4",action:function(row){
    //     this.c_listing_byDraft();
    // }},
    {label:"删除",value:"5",api:url_update_listing,action:function(row){
        let data = {
            ids:`${row.id}`,
            action:"del"
        };
        this.operate_del(data,row)
    }},
    // {label:"操作日志",value:"6",action:function(row){
    //   console.log("操作日志")
    // }},
];
