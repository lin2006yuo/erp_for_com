const has=1;
const stay=2;
const abnormal=3;
const fail=4;
import {
    api_edit_listing,
    api_publish_edit,
    api_publish_del,
    api_amazon_defeat,
    url_amazon_defeat,
    url_edit_listing,
    url_publish_del,
    url_publish_edit,
    url_amazon_logs
} from '../../../../api/amazon-publish-list';
export const operateList = [
    {label:"停售",value:"1",api:url_edit_listing,action:function(row){
        if(row.fulfillment_type === 2){
            this.$message({
                type: 'info',
                message: 'FBA订单暂不支持停售'
            });
            return
        }
        let parameter = {
            type:'quantity',
            data:[{
                amazon_listing_id:row.amazon_listing_id,
                account_id:row.account_id,
                new_value:0,
                old_value:row.quantity
            }]
        };
        this.$http(api_edit_listing, parameter).then(res=>{
            this.$message({
                type: 'success',
                message: res.message || res
            })
        }).catch(code=>{
            this.$message({
                type:"error",
                message:code.message || code
            })
        });

    },status:[has]},
    {label:"删除",value:"2",api:url_publish_del,action:function(row){
        console.log('删除');
        let parameter = {
            type:'seller_status',
            data:[{
                amazon_listing_id:row.amazon_listing_id,
                account_id:row.account_id,
                new_value:3,
                old_value:row.seller_status
            }]
        };

        this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$http(api_edit_listing, parameter).then(res=>{
                this.$message({
                    type: 'success',
                    message: `已删除`
                })
            }).catch(code=>{
                this.$message({
                    type:"error",
                    message:code.message || code
                })
            });
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });

    },status:[has]},
    {label:"操作日志",value:"3",api:url_amazon_logs,action:function(row){
        this.logVisible = true;
        this.amazon_listing_id = row.amazon_listing_id;
    },status:[has]},
    {label:"编辑描述",value:"4",api:url_edit_listing,action:function(row){
        this.id = row.id;
        this.account_id = row.account_id;
        this.amazon_listing_id = row.amazon_listing_id;
        this.contentVisible = true;
    },status:[has]},
    {label:'修改图片',value:'5',api:'',action:function(row) {
        this.changeImageDialog = true;
        if(!row.goods_id)return this.$message({type:'warning',message:'该Listing尚未关联，请先关联本地SKU！'});
        let obj = {
            baseUrl:row.base_url,
            account_id:row.account_id,
            amazon_listing_id:row.amazon_listing_id,
            goods_id:row.goods_id,
            images:[],
        };
        this.rowData = obj;
    },status:[has]}
];
export const publish_queue_action = [
    {label:'编辑',value:"1",api:url_publish_edit,action:function(row){
        let params = {
            id:row.id,
            spu: row.spu,
            goods_id: row.goods_id,
            account_id: row.account_id,
            site: row.site,
            add: false,
            curPage:'queue',//刊登记录
        };
        this.$open(`/kandeng/amazon/info`, params);
    },status:[has]},
    {label:'复制',value:"2",api:url_publish_edit,action:function(row){
            let params = {
                id:row.id,
                spu: row.spu,
                goods_id: row.goods_id,
                account_id: row.account_id,
                site: row.site,
                add: false,
                curPage:'copy',//刊登记录
            };
            this.$open(`/kandeng/amazon/info`, params)
    },status:[has]},
    {label:'删除',value:"3",api:url_publish_del,action:function(row){
        if(row.publish_status===2||row.publish_status===1)return this.$message({type:"warning",message:'上传中&已上传状态的数据不允许删除!'});
        this.$http(api_publish_del, {id: row.id}).then(res=>{
            this.$message({
                type: 'success',
                message: res.message || res
            });
            let findIndex = this.tableData.findIndex(item=>{
                return item === row;
            });
            if(findIndex !== -1){
                this.tableData.splice(findIndex, 1);
            }
        }).catch(code=>{
            this.$message({
                type:"error",
                message:code.message || code
            })
        })
    },status:[has]},
    {label:'强制失败',value:"4",api:url_amazon_defeat,action:function(row){
        this.$http(api_amazon_defeat,row.id).then(res => {
            this.$message({type:'success',message:res.message});
            this.init();
        }).catch(code => {
            this.$message({type:'error',message:code.message});
        })
    },status:[has]},
];
