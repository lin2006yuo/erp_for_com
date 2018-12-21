<template>
    <page-dialog v-model="show" @open="open" size="large" title="修改包装重量" :close-on-click-modal="false">
        <div >
            <p>
                <el-radio  v-model="weight.select" label="1">统一修改为：</el-radio>
                <ui-limit-number   v-model="weight.textall"
                                   style="width:150px"
                                   :limit="3"
                                   :disabled="weight.select!=='1'"
                                   class="inline" >

                </ui-limit-number>公斤
            </p>
            <p>
                <el-radio v-model="weight.select" label="2">按重量增加：</el-radio>
                <ui-limit-number v-model="weight.textadd"
                                   style="width:150px"
                                   :limit="3"
                                 :disabled="weight.select!=='2'"
                                   class="inline" >
                </ui-limit-number>公斤
            </p>
            <p>
                <el-radio  v-model="weight.select" label="3">按涨幅增加：</el-radio>
                <ui-limit-number   v-model="weight.textaup"
                                   style="width:150px"
                                   :limit="3"
                                   :disabled="weight.select!=='3'"
                                   class="inline" >
                </ui-limit-number>%
            </p>
            <p>
                <label class="has-inline text-right" style="width: 90px;"> 定时提交修改：</label>
                <el-date-picker
                    v-model="weight.cron_time"
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
                    v-model="weight.remark">
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
                prop="gross_weight"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="weight"
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
    }
</style>
<script>
    import {
        api_aliexpress_batch_product
    } from "../../../../../api/publish-smt"
    export default{
        data(){
            return{
                show:this.value,
                weight:{
                    select:"",
                    textall:"",
                    textadd:"",
                    textaup:"",
                    cron_time:"",
                    remark:"",
                },
            }
        },
        created(){
        },
        methods:{
            open(){
                this.init();
            },
            init(){
                this.weight = {
                    select:"",
                    textall:"",
                    textadd:"",
                    textaup:"",
                    cron_time:"",
                    remark:"",
                };
            },
            look(){
                if(this.weight.select===""){
                    this.$message({type:"warning",message:"请选择修改方式"})
                    return  false;
                }
                switch (this.weight.select){
                    case '1':
                        this.selectedIds.forEach(row=>{
                            this.$set(row,"weight",this.weight.textall)
                        });
                        break;
                    case "2":
                        this.selectedIds.forEach(row=>{
                            let weight=(parseFloat(row.gross_weight)+parseFloat(this.weight.textadd)).toFixed(3);
                            this.$set(row,"weight",weight)
                        });
                        break;
                    case "3":
                        this.selectedIds.forEach(row=>{
                            this.$set(row,"weight",(parseFloat(row.gross_weight)*(1+parseFloat(this.weight.textaup)/100)).toFixed(3))
                        });
                        break;
                }
                return true

            },
            keep(){
                let flag=this.look();
                if(this.weight.cron_time && this.weight.cron_time instanceof Object){
                    this.weight.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.weight.cron_time/1000);
                }else if(!this.weight.cron_time){
                    this.weight.cron_time = "";
                }
                if(flag){
                    let data= this.selectedIds.map(row=>{
                        return {
                            product_id:row.id,
                            value:row.weight
                        }
                    })
                    let postData={
                        type:"weight",
                        data:data,
                        cron_time:this.weight.cron_time || 0,
                        remark:this.weight.remark.trim(),
                    };
                    this.$http(api_aliexpress_batch_product,postData).then(res=>{
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
            bageName(){
                let find=this.bags.find(row=>{
                    return this.bag.unit===row.id
                });
                if(!!find){
                    return find.name
                }else {
                    return "件"
                }
            },
        },
        props:{
            value:{
                required:true,
            },
            selectedIds:{
                required:true,
                type:Array,
            },
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default
        }
    }
</script>
