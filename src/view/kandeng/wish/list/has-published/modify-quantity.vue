<template>
    <page-dialog v-model="show" @open="open" size="large" title="修改可售量" :close-on-click-modal="false">
        <p>
            <label class="inline text-right" style="width: 120px;">批量修改可售数为：</label>
            <integer-input v-model="counts" :min="1" class="width-sm inline"></integer-input>
        </p>
        <p>
            <label class="inline text-right" style="width: 120px;"> 定时提交修改：</label>
            <el-date-picker
                v-model="cron_time"
                type="datetime"
                class="inline"
                placeholder="选择日期时间">
            </el-date-picker>
        </p>
        <p>
            <label class="inline text-right" style="width: 120px;"> 修改备注：</label>
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
                prop="inventory"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="newInventory"
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
                counts:"",
                cron_time:"",
                remark:"",
                cloneData:[],
            }
        },
        methods:{
            open(){
                this.counts="";
                this.cron_time="";
                this.remark="";
                this.cloneData = clone(this.selectedIds);
            },
            look(){
                let flag=true;
                this.selectedIds.forEach((row,index)=>{
                    let find = this.cloneData.find(res=>res.product_id===row.product_id);
                    if(!!find){
                        let newPrice = this.transit_change(this.counts,find.inventory,find,index)?this.counts:find.inventory;
                        this.$set(row,"newInventory",newPrice)
                    }
                })
                return flag;
            },
            transit_change(newV,old,row,index){
                let cur = true;
                if(!!row.is_promoted&&parseFloat(newV)<parseFloat(old)) {
                    cur = false;
                    this.$message({type:"warning",message:`第${index+1}行，为促销产品，产品数量不允许减少`});
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
                        return {variant_id:row.variant_id,inventory:row.newInventory}
                    });
                    let data={
                    	type:'inventory',
                        data:table,
                        cron_time:this.cron_time || 0,
                        remark:this.remark,
                    };
                    this.$http(api_wish_batch_edit,data).then(res=>{
                        this.show = false;
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('change-data',this.selectedIds.map(row=>{
                            return {variant_id:row.variant_id,shipping_time:row.newShipping_time,};
                        }))
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                };
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
