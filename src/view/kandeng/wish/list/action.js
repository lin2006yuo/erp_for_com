/**
 * Created by RondaFul on 2016/11/2.
 */
import {url_wish_express_save,url__wish_update,url_wish_rsync,api_wish_del,url_wish_del,api_wish_del_draft,url_wish_action_log} from "../../../../api/kandeng"
const has=1;//已刊登
const stay=2;//刊登队列
const timing=4;//刊登异常
const draft=5;//草稿箱
export const operateList = [
    {label:"编辑",value:"1",stauts:[has],api:url__wish_update,action:function(row,id){
        /**
         * is_promoted  是否为促销
         * curModel 判断当前是哪个模块  has:已刊登
         * **/
        let goods = row.goods_id?row.goods_id:0;
        let param={id:row.id,goods_id:goods,isAdd:false,isCopy:false,isTime:false,is_promoted:row.is_promoted,curModel:'has'};
        this.$open('/kandeng/wish/info',param)
    }},
    {label:"编辑",value:"2",stauts:[stay,timing,draft],api:url__wish_update,action:function(row,id){
        let param = {};
        let goods = row.goods_id?row.goods_id:0;
        if(id===5){
            if(!goods){
                return this.$message({type: "info", message: '请关联商品'})
            }
            param={id:goods,goods_id:goods,isAdd:true,isCopy:false,curModel:"draft"};
        }else if(id===2){
           param={id:row.id,goods_id:goods,isAdd:false,isCopy:false,isTime:true,curModel:"wait"};
        }else if(id===4){
            param={id:row.id,goods_id:goods,isAdd:false,isCopy:false,isTime:true,curModel:"timing"};
        }
        this.$open('/kandeng/wish/info',param)
    }},
    {label:"复制",value:"3",stauts:[has],api:url_wish_rsync,action:function(row){
        let param={id:row.id,goods_id:row.goods_id,isAdd:true,isCopy:true,curModel:'has'};
        this.$open('/kandeng/wish/info',param)
    }},
    {label:"WE设置",value:"7",stauts:[has], api:url_wish_express_save,action:function(row){
            this.$refs.express.id=row.product_id;
            this.expressVisable=true;
    }},
    {label:"删除",value:"6",stauts:[stay,timing,draft], api:url_wish_del,action:function(data,index){
        let spu=data.parent_sku||data.spu
        this.$confirm(`您将删除:${spu}, 确认此操作吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            if(index===draft){
                this.$http(api_wish_del_draft,{id:data.id}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.operate_del(data)
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code});
                })
            }else {
                this.$http(api_wish_del,{id:data.id}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.operate_del(data)
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code});
                })
            }
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消'
            });
        });

    }},
    {label:"操作日志",value:"10",stauts:[has], api:url_wish_action_log,action:function(row){
       this.productId=row.product_id;
        this.logVisable=true;
    }},
];
