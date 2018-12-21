<template>
    <page-dialog v-model="show" @open="open" size="large" title="修改零售价" :close-on-click-modal="false">
        <div>
            <p>
                <el-radio  v-model="price.select" label="1">按照金额增加</el-radio>
                <ui-limit-number style="width:100px" class="inline" v-model="price.add" :limit="2" :nagetive="true" :min="min" :disabled="price.select!=='1'"></ui-limit-number>USD
            </p>
            <p>
                <el-radio  v-model="price.select" label="2">按照涨幅增加</el-radio>
                <ui-limit-number style="width:100px" class="inline" v-model="price.up" :limit="2" :nagetive="true" :min="-100" :disabled="price.select!=='2'"></ui-limit-number>%
            </p>
            <p style="color: red">小提示：如果减少，可以输入负数</p>
            <p>
                <label class="has-inline text-right" style="width: 90px;"> 定时提交修改：</label>
                <el-date-picker
                    v-model="price.cron_time"
                    type="datetime"
                    class="has-inline"
                    placeholder="选择日期时间">
                </el-date-picker>
            </p>
            <p>
                <label class="has-inline text-right" style="width: 90px;"> 修改备注：</label>
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:35%"
                    placeholder="请输入内容"
                    v-model="price.remark">
                </el-input>
            </p>
        </div>
        <div>
            <el-button size="mini"
                       @click.native="look"
                       type="primary"
                       class="mt-sm mb-sm fr">预览</el-button>
        </div>
        <el-table
            :data="selectedIds"
            style="width: 100%">
            <el-table-column
                prop="product_id"
                label="商品ID"
            >
            </el-table-column>
            <el-table-column
                prop="sku_price"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="newPrice"
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
    import {
        api_aliexpress_batch_price
    } from "../../../../../api/publish-smt"
    export default{
        data(){
            return{
                show:this.value,
                price:{
                    select:"",
                    add:"",
                    up:"",
                    cron_time:"",
                    remark:""
                },
            }
        },
        created(){
        },
        methods:{
            open(){
                this.clear();
            },
            clear(){
                this.price = {
                    select:"",
                    add:"",
                    up:"",
                    cron_time:"",
                    remark:""
                }
            },
            look(){
                if(this.price.select===""){
                    this.$message({type:"warning",message:"请选择修改方式"});
                    return  false;
                }
                switch (this.price.select){
                    case "1":
                        this.selectedIds.forEach(row=>{
                            let price=parseFloat(row.sku_price)+ Number(this.price.add);
                            this.$set(row,"newPrice",price.toFixed(2))
                        })
                        break;
                    case "2":
                        this.selectedIds.forEach(row=>{
                            let price=(parseFloat(row.sku_price))*(1+ Number(this.price.up)/100);
                            this.$set(row,"newPrice",price.toFixed(2))
                        });
                        break;
                }
                return true
            },
            keep(){
                let flag=this.look();
                if(this.price.cron_time && this.price.cron_time instanceof Object){
                    this.price.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.price.cron_time/1000);
                }else if(!this.price.cron_time){
                    this.price.cron_time = "";
                }
                if(flag){
                    let data=  this.selectedIds.map(row=>{
                        let data_row={
                            product_id:row.product_id,
                            sku:row.sku_code,
                            price:row.newPrice,
                            old_price:row.sku_price
                        }
                        return  data_row
                    })
                    let params = {
                    	data:data,
                        cron_time:this.price.cron_time || 0,
                        remark:this.price.remark.trim(),
                    }
                    this.$http(api_aliexpress_batch_price,params).then(res=>{
                            this.$message({type:"success",message:res.message||res});
                        this.$emit('change-data',data)
                        this.show=false
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
        	min(){
                let arr = this.selectedIds.map(row=> row.sku_price);
                Array.prototype.min = function(){
                    return Math.min.apply({},this)
                };
                return -arr.min();
            }
        },
        props:{
            value:{
                required:true,
            },
            selectedIds:{
                required:true,
                type:Array,
            },
            accountId:{
            }
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default
        }
    }
</script>
