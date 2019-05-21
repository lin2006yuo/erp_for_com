<template>
    <page-dialog @open="open" v-model="show" size="large" title="修改运费模板" :close-on-click-modal="false">
        <div>
            <p>
                <label class="has-inline text-right" style="width: 90px;"> 运费模板：</label>
                <el-select v-model="shippingTemplate" placeholder="请选择" class="inline">
                    <el-option
                        :key="item.template_id"
                        v-for="item in template"
                        :label="item.template_name"
                        :value="item.template_id">
                    </el-option>
                </el-select>
            </p>
            <p>
                <label class="has-inline text-right" style="width: 90px;"> 定时提交修改：</label>
                <el-date-picker
                    v-model="cron_time"
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
                    v-model="remark">
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
                prop="freight_template_name"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="template_name"
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
        api_aliexpress_template,
        api_aliexpress_batch_product
    } from "../../../../../api/publish-smt"
    export default{
        data(){
            return{
                show:this.value,
                shippingTemplate:"",
                serviceTemplate:'',
                template:[],
                template_name:"",
                cron_time:"",
                remark:""
            }
        },
        created(){
        },
        methods:{
            open(){
                this.clear();
                this.get_template()
            },
            get_template(){
                this.$http(api_aliexpress_template,{account_id:this.accountId}).then(res=>{
                    this.template=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            clear(){
                this.serviceTemplate = "";
                this.template_name = "";
                this.shippingTemplate = "";
                this.cron_time = "";
                this.remark = "";
            },
            look(){
                if(this.shippingTemplate===""){
                    this.$message({type:"warning",message:"请选择运费模板"})
                    return  false;
                }
                let find=this.template.find(row=>{
                    return row.template_id===this.shippingTemplate;
                })
                if(!find){
                    return false
                }
                this.template_name = find.template_name;
                this.selectedIds.forEach(row=>{
                    this.$set(row,"template_name",find.template_name)
                    this.$set(row,"template_id",find.template_id)
                })
                return true
            },
            keep(){
                let flag=this.look();
                if(this.cron_time && this.cron_time instanceof Object){
                    this.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.cron_time/1000);
                }else if(!this.cron_time){
                    this.cron_time = "";
                }
                if(flag){
                    let data= this.selectedIds.map(row=>{
                        return {
                            product_id:row.id,
                            value:row.template_id
                        }
                    });
                    let postData={
                        type:"freightTemp",
                        data:data,
                        cron_time:this.cron_time || 0,
                        remark:this.remark.trim()
                    };
                    this.$http(api_aliexpress_batch_product,postData).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('change-data',data,this.template_name)
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
            accountId:{
            }
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default
        }
    }
</script>
