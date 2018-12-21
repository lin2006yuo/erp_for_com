<template>
    <page-dialog v-model="show" @open="open" size="large" title="修改发货期" :close-on-click-modal="false">
        <p>
            <label class="inline text-right" style="width: 120px;">批量修改发货期为：</label>
            <integer-input class="inline width-90" v-model="shipTime[0]" :min="1"></integer-input>&nbsp;-&nbsp;<integer-input
                class="inline width-90" v-model="shipTime[1]" :min="1"></integer-input>
        </p>
        <p>
            <label class="has-inline text-right" style="width: 120px;"> 定时提交修改：</label>
            <el-date-picker
                v-model="cron_time"
                type="datetime"
                class="inline width-super"
                placeholder="选择日期时间">
            </el-date-picker>
        </p>
        <p>
            <label class="inline text-right" style="width: 120px;"> 修改备注：</label>
            <el-input
                class="inline"
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
                prop="shipping_time"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="newShipping_time"
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
    .width-90{
        width:90px !important;
    }
</style>
<script>
    import {api_wish_batch_edit} from "../../../../../api/kandeng"
    export default{
        data(){
            return{
                show:this.value,
                shipTime:["",""],
                cron_time:"",
                remark:"",
            }
        },
        created(){
        },
        methods:{
            open(){
                this.clear();
            },
            clear(){
                this.shipTime = ["",""];
                this.cron_time="";
                this.remark="";
            },
            look(){
                let flag=true;
                this.selectedIds.forEach(row=>{
                    this.$set(row,"newShipping_time",this.shipTime[0]+"-"+this.shipTime[1])
                });
                return flag;
            },
            keep(){
                let flag=this.look();
                if(this.cron_time && this.cron_time instanceof Object){
                    this.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.cron_time/1000);
                }else if(!this.cron_time){
                    this.cron_time = "";
                }
                if(flag){
                    let table = this.selectedIds.map(row=>{
                        return {variant_id:row.variant_id,shipping_time:row.newShipping_time};
                    });
                    let data={
                    	type:'shipping_time',
                        data:table,
                        cron_time:this.cron_time || 0,
                        remark:this.remark,
                    };
                    this.$http(api_wish_batch_edit,data).then(res=>{
                        this.show=false;
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('change-data',this.selectedIds.map(row=>{
                            return {variant_id:row.variant_id,shipping_time:row.newShipping_time,}
                        }))
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
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
        computed:{
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
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
            integerInput:require('../../../../../components/integer-input.vue').default,
        }
    }
</script>
