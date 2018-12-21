/**
 * Created by RondaFul on 2016/11/2.
 */
import {url_offline_ebay_product} from '../../../../../api/ebay-kandeng-operated'
import {url_save_listing,url_get_action_logs} from '../../../../../api/ebay-kandeng-public-module';
export const operateList = [
    {label:"编辑",value:"2",api:url_save_listing,action:function(row){
        let params={id:row.id,goods_id:row.goods_id,isAdd:false,isCopy:false,isCopyListing:true,curPage:'already'};
        this.$open('/add-listing',params)
    }},
    // {label:"转移",value:"3",action:function(row){
    //   console.log("功能建设中。。。")
    // }},
    {label:"复制",value:"3",api:url_save_listing,action:function(row){
        let params={id:row.id,goods_id:row.goods_id,isAdd:true,isCopy:true,isCopyListing:false,curPage:'already'};
        this.$open('/add-listing',params)
    }},
    {label:"下架",value:"4",api:url_offline_ebay_product,action:function(row){
        this.oprate_offline(`${row.item_id}`,row);
    }},
    {label:"操作日志",value:"5",api:url_get_action_logs,action:function(row){
        this.productId=row.item_id;
        this.logVisable=true;
    }},
];
