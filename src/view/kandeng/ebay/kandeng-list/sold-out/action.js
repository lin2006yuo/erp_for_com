/**
 * Created by RondaFul on 2016/11/2.
 */
import {url_save_listing} from '../../../../../api/ebay-kandeng-public-module';
export const operateList = [
    {label:"编辑",value:"3",api:url_save_listing,action:function(row){
      let params={id:row.id,goods_id:row.goods_id,isAdd:false,isCopy:false,isCopyListing:false,curPage:'soldOut'};
      this.$open('/add-listing',params)
    }},
    // {label:"操作日志",value:"4",action:function(row){
    //   console.log("操作日志")
    // }},
];
