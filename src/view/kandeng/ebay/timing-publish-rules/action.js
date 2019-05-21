/**
 * Created by RondaFul on 2016/11/2.
 */
import {url_update_listing,url_remove_timing_rule_list} from '../../../../api/ebay-kandeng-public-module'
export const operateList = [
    {label:"编辑",value:"2",api:url_update_listing,action:function(row){
        this.edit(row);
    }},
    {label:"删除",value:"3",api:url_remove_timing_rule_list,action:function(row){
      this.del(row.id,row)
    }},
    // {label:"移除范本",value:"4",action:function(row){
      // console.log("移除范本")
      // let param={id:row.id,isAdd:false,isCopy:true};
      // this.$open('/kandeng/aliexpress/info',param)
    // }},
];
