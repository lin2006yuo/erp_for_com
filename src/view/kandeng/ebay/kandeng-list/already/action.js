/**
 * Created by RondaFul on 2016/11/2.
 */
import {url_offline_ebay_product} from '../../../../../api/ebay-kandeng-operated'
import {url_save_listing,url_get_action_logs} from '../../../../../api/ebay-kandeng-public-module';
export const operateList = function () {
    return [
        {label:this.$t('ebay-list.edit'),value:"2",api:url_save_listing,action:function(row){
                let params={id:row.id,goods_id:row.goods_id,isAdd:false,isCopy:false,isCopyListing:true,curPage:'already'};
                this.$open('/add-listing',params)
            }},
        // {label:"转移",value:"3",action:function(row){
        //   console.log("功能建设中。。。")
        // }},
        {label:this.$t('ebay-list.copy'),value:"3",api:url_save_listing,action:function(row){
                let params={id:row.id,goods_id:row.goods_id,isAdd:true,isCopy:true,isCopyListing:false,curPage:'already'};
                this.$open('/add-listing',params)
            }},
        {label:this.$t('ebay-list.isSaleOff'),value:"4",api:url_offline_ebay_product,action:function(row){
                this.single_oprate(`${row.item_id}`,row);
            }},
        {label:this.$t('ebay-list.operate'),value:"5",api:url_get_action_logs,action:function(row){
                this.productId=row.item_id;
                this.logVisable=true;
            }},
    ];
}
