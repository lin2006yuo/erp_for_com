/**
 * Created by RondaFul on 2016/11/2.
 */
import {url_aliexpress_edit_product,url_aliexpress_copy_product,url_aliexpress_batch_online,url_aliexpress_batch_offline,url_aliexpress_batch_group,url_aliexpress_batch_del,api_aliexpress_batch_del,
    url_aliexpress_batch_delivery,url_aliexpress_batch_eff,url_aliexpress_rsync,url_aliexpress_rsync_update,url_logs} from  "../../../../api/publish-smt"
import {url_set_window_products} from  "../../../../api/aliexpress-windows"
const has=1;
const stay=2;
const abnormal=3;
const fail=4;
export const operateList = [
    {label:"编辑",value:"1",api:url_aliexpress_edit_product,action:function(row,temp){
        let params ={
            id:row.id,
            isAdd:false,
            isCopy:false,
            isTime:false,
            show:false,
            // title: `${row.product_id}编辑`
        };
        // this.$open(`/kandeng/aliexpress/info/${row.id}`,params);
        this.$open(`/kandeng/aliexpress/info`,params);
    },status:[has]},
    {label:"编辑",value:"2",api:url_aliexpress_edit_product,action:function(row,temp){
        let params ={
            id:row.id,
            isAdd:false,
            isCopy:false,
            isTime:true,
            show:false,
            index:row.id,
            // title: `${row.goods_spu}编辑`
        };
        switch (temp){
            case  fail:
                params.show=true;
                break;
            default:
                params.show=false;
                break;
        }
        // this.$open(`/kandeng/aliexpress/info/${row.id}`,params);
        this.$open(`/kandeng/aliexpress/info`,params);
    },status:[stay,abnormal,fail]},
    {label:"复制",value:"3",api:url_aliexpress_copy_product,action:function(row){
        let params ={
            id:row.id,
            isAdd:true,
            isCopy:true,
            isTime:true,
            show:true,
            // title: `${row.product_id}复制`
        };
        // this.$open(`/kandeng/aliexpress/info/${row.id}`,params);
        this.$open(`/kandeng/aliexpress/info`,params);
    },status:[has]},
    {label:"删除",value:"4",api:url_aliexpress_batch_del,action:function(row){
        this.$confirm(`您将删除 ${row.goods_spu}, 确认此操作吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$http(api_aliexpress_batch_del,{ids:row.id}).then(res=>{
                this.$message({type:"success",message:res.message||res})
                this.operate_del(row.id,row)
            }).catch(code=>{
                this.$message({message:code.message||code,type:'error'})
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
    },status:[abnormal,stay,fail]},
    {label:"操作日志",value:"5",api:url_logs,action:function(row){
        this.logVisable = true;
        this.productId=row.product_id;
    },status:[has]},
];

export const  btnList=[
    {name:'批量上架',status:1,api:url_aliexpress_batch_online},
    {name:'批量下架',status:2,api:url_aliexpress_batch_offline},
//  {name:'定时设置',status:3},
    {name:'批量修改产品分组',status:4,api:url_aliexpress_batch_group},
    {name:'一键修改发货期',status:5,api:url_aliexpress_batch_delivery},
    {name:'批量设为橱窗推荐',status:9,api:url_set_window_products},
    {name:'批量延长有效期',status:6,api:url_aliexpress_batch_eff},
    {name:'同步Listing',status:7,api:url_aliexpress_rsync},
    // {name:'提交修改',status:8,api:url_aliexpress_rsync_update},
]
