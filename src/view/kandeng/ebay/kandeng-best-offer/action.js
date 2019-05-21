import {url_best_offer_batch,url_ebay_best_offer_delete,api_ebay_best_offer_delete,api_best_offer_batch} from '@/api/ebay-kandeng-public-module';
export const operateList = function () {
    return [
        {label:'接受',value:"2",api:url_best_offer_batch,action:function(row){
                this.$confirm(`您将接受bestofferid：${row.best_offer_id}的议价，确认此操作吗？`, 'BestOffer处理：接受', {
                    confirmButtonText: this.$t('ebay-list.yes'),
                    cancelButtonText: this.$t('ebay-list.no'),
                    type: 'warning'
                }).then(() => {
                    this.$http(api_best_offer_batch,{action:'accept',bestOfferIds:row.best_offer_id}).then(res=>{
                        this.$message({type:"success",message: res.message||res});
                        this.init();
                    }).catch(code=>{
                        this.$message({type:"error",message: code.message||code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ebay-list.Cancelled')
                    });
                });
            }},
        {label:'拒绝',value:"3",api:url_best_offer_batch,action:function(row){
                this.bargainShow=true;
                this.reject=true;
            }},
        {label:'议价',value:"4",api:url_best_offer_batch,action:function(row){
                this.bargainShow=true;
                this.reject=false;
            }},
        {label:'删除',value:"5",api:url_ebay_best_offer_delete,action:function(row){
                this.$confirm(`您将删除bestofferid：${row.best_offer_id}的议价，确认此操作吗？`, 'BestOffer处理：删除', {
                    confirmButtonText: this.$t('ebay-list.yes'),
                    cancelButtonText: this.$t('ebay-list.no'),
                    type: 'warning'
                }).then(() => {
                    this.$http(api_ebay_best_offer_delete,{ids:row.id}).then(res=>{
                        this.$message({type:"success",message: res.message||res});
                       this.tableData=this.tableData.filter(res=>{
                           return res.id!==row.id;
                       })
                    }).catch(code=>{
                        this.$message({type:"error",message: code.message||code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ebay-list.Cancelled')
                    });
                });

            }},
    ];
}
