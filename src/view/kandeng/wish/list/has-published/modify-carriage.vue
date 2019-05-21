<template>
    <page-dialog @open="open" v-model="show" size="large" title="修改运费" :close-on-click-modal="false">
        <p>
            <label class="inline text-right" style="width: 120px;">批量修改运费为($)： </label>
            <ui-limit-number  v-model="shipping" :limit="2" class="inline">
            </ui-limit-number>
        </p>
        <p>
            <label class="has-inline text-right" style="width: 120px;"> 定时提交修改：</label>
            <el-date-picker
                v-model="cron_time"
                type="datetime"
                class="has-inline"
                placeholder="选择日期时间">
            </el-date-picker>
        </p>
        <p>
            <label class="has-inline text-right" style="width: 120px;"> 修改备注：</label>
            <el-input
                type="textarea"
                :rows=4
                style="width:35%"
                placeholder="请输入内容"
                v-model="remark">
            </el-input>
        </p>
        <el-row>
            <el-button size="mini"
                       @click.native="look"
                       type="primary"
                       class="mt-sm mb-sm fr">预览</el-button>
        </el-row>
        <el-table
            :data="selectedIds"
            style="width: 100%">
            <el-table-column
                prop="product_id"
                label="商品ID"
            >
            </el-table-column>
            <el-table-column
                prop="shipping"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="newShipping"
                label="修改后">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">保存待同步平台</el-button>
            <el-button size="mini" @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .text-right{
        text-align: right;
        padding-right:5px;
    }
</style>
<script>
    import {api_wish_batch_edit} from "../../../../../api/kandeng"
    export default{
        data(){
            return{
                show:this.value,
                shipping:"",
                cron_time:"",
                remark:"",
                cloneData:[],
            }
        },
        created(){
        },
        methods:{
            open(){
                this.clear();
                this.cloneData = clone(this.selectedIds);
            },
            clear(){
                this.shipping = "";
                this.cron_time = "";
                this.remark = "";
            },
            look(){
                let flag=true;
                this.selectedIds.forEach((row,index)=>{
                    let find = this.cloneData.find(res=>res.product_id === row.product_id);
                    if(!!find){
                        let newPrice = this.transit_change(this.shipping,find.shipping,find,index)?this.shipping:find.shipping;
                        this.$set(row,"newShipping",newPrice);
                    }
                });
                return flag;
            },
            transit_change(newV,old,row,index){
                let cur = true;
                if(!!row.is_promoted&&parseFloat(newV)>parseFloat(old)) {
                    cur = false;
                    this.$message({type:"warning",message:`第${index+1}行，为促销产品，运费不允许提高`});
                }
                return cur;
            },
            keep(){
                let b=this.look();
                if(this.cron_time && this.cron_time instanceof Object){
                    this.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.cron_time/1000);
                }else if(!this.cron_time){
                    this.cron_time = "";
                }
                if(b){
                    let table=this.selectedIds.map(row=>{
                        return {variant_id:row.variant_id,shipping:row.newShipping}
                    });
                    let data={
                    	type:'shipping',
                        data:table,
                        cron_time:this.cron_time || 0,
                        remark:this.remark,
                    };
                    this.$http(api_wish_batch_edit,data).then(res=>{
                        this.show = false;
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('change-data',this.selectedIds);
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                }
            },
            close(){
                this.show =false;
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
            },
            selectedIds:{
                require:true,
                type:Array
            }
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default
        }
    }
</script>
