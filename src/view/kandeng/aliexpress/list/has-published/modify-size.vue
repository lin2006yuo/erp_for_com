<template>
    <page-dialog @open="open" v-model="show" size="large" title="修改尺寸" :close-on-click-modal="false">
        <div>
            <p>
                <label class="has-inline text-right" style="width: 90px;"> 长：</label>
                <ui-limit-number style="width:150px" class="inline"
                                 v-model="size.length"
                                 :limit="1" ></ui-limit-number>厘米
            </p>
            <p>
                <label class="has-inline text-right" style="width: 90px;"> 宽：</label>
                <ui-limit-number style="width:150px" class="inline"
                                 v-model="size.width"
                                 :limit="1" ></ui-limit-number>厘米
            </p>
            <p>
                <label class="has-inline text-right" style="width: 90px;"> 高：</label>
                <ui-limit-number style="width:150px" class="inline"
                                 v-model="size.height"
                                 :limit="1" ></ui-limit-number>厘米
            </p>
            <p>
                <label class="has-inline text-right" style="width: 90px;"> 定时提交修改：</label>
                <el-date-picker
                    v-model="size.cron_time"
                    type="datetime"
                    class="has-inline"
                    placeholder="选择日期时间">
                </el-date-picker>
            </p>
            <p>
                <label class="has-inline text-right" style="width: 90px;">修改备注：</label>
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:35%"
                    placeholder="请输入内容"
                    v-model="size.remark">
                </el-input>
            </p>
        </div>
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
                label="修改前"
                inline-template
            >
                <span>{{row.package_length}}×{{row.package_width}}×{{row.package_height}}</span>
            </el-table-column>
            <el-table-column
                prop="newSize"
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
        api_aliexpress_batch_size
    } from "../../../../../api/publish-smt"
    export default{
        data(){
            return{
                show:this.value,
                size:{
                    length:"",
                    width:"",
                    height:"",
                    cron_time:"",
                    remark:""
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
                this.size = {
                    length:"",
                    width:"",
                    height:"",
                    cron_time:"",
                    remark:""
                };
            },
            look(){
                if(this.size["length"]===0||!this.size.width===0||!this.size.height===0){
                    this.$message({type:"warning",message:"请输入完整的长宽高"})
                    return  false;
                }
                this.selectedIds.forEach(row=>{
                    this.$set(row,"newSize",this.size["length"]+"×"+this.size.width+"×"+this.size.height);
                });
                return  true
            },
            keep(){
                let flag=this.look();
                if(this.size.cron_time && this.size.cron_time instanceof Object){
                    this.size.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.size.cron_time/1000);
                }else if(!this.size.cron_time){
                    this.size.cron_time = "";
                }
                if(flag){
                    let product=this.selectedIds.map(row=>row.id);
                    let postData={
                        product_ids:product.join(","),
                        length:this.size["length"],
                        width:this.size.width,
                        height:this.size.height,
                        cron_time:this.size.cron_time || 0,
                        remark:this.size.remark.trim()
                    }
                    this.$http(api_aliexpress_batch_size,postData).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('change-data',product,postData)
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
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
        }
    }
</script>
