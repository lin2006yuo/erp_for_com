<template>
    <page-dialog @open="open" v-model="show" size="large" title="修改服务模板" :close-on-click-modal="false">
        <div>
            <p>
                <label class="has-inline text-right" style="width: 90px;"> 服务模板：</label>
                <el-select v-model="serviceTemplate" placeholder="请选择" class="inline">
                    <el-option
                        :key="item.template_id"
                        v-for="item in severTemplate"
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
                prop="promise_template_name"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="newPromise"
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
        api_aliexpress_batch_product,
        api_aliexpress_service_template
    } from "../../../../../api/publish-smt"
    export default{
        data(){
            return{
                show:this.value,
                serviceTemplate:"",
                severTemplate:[],
                newPromise:"",
                cron_time:"",
                remark:""
            }
        },
        created(){
        },
        methods:{
            open(){
                this.clear();
                this.get_sever_template()
            },
            get_sever_template(){
                this.$http(api_aliexpress_service_template,{account_id:this.accountId}).then(res=>{
                    this.severTemplate=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            clear(){
                this.serviceTemplate = "";
                this.cron_time = "";
                this.remark = ""
            },
            look(){
                if(this.serviceTemplate===""){
                    this.$message({type:"warning",message:"请选择服务模板"})
                    return  false;
                }
                let find=this.severTemplate.find(row=>{
                    return row.template_id===this.serviceTemplate;
                })
                if(!find){
                    return false
                }
                this.newPromise = find.template_name
                this.selectedIds.forEach(row=>{
                    this.$set(row,"newPromise",find.template_name);
                    this.$set(row,"promise_template_id",find.template_id)
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
                            value:row.promise_template_id
                        }
                    })
                    let postData={
                        type:"promiseTemp",
                        data:data,
                        cron_time:this.cron_time || 0,
                        remark:this.remark.trim()
                    };
                    this.$http(api_aliexpress_batch_product,postData).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('change-data',data,this.newPromise)
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
