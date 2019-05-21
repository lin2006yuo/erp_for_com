<template>
    <page-dialog v-model="show" size="large" @open="open" title="修改发货期" :close-on-click-modal="false">
        <el-row class="mb-xs">
            <el-col :span="3" class="text-right"><span class="ml-sm">修改方式：</span></el-col>
            <el-col :span="21">
                <div class="mb-xs">
                    <el-radio  v-model="delivery.select" label="1">修改为</el-radio>
                    <integer-input v-model="delivery.text" :min="0"
                                   class="inline"
                                   :disabled="delivery.select!=='1'"
                                   style="width:100px"
                    ></integer-input>天
                </div>
                <div>
                    <el-radio v-model="delivery.select" label="2">增加&nbsp;&nbsp;&nbsp;</el-radio>
                    <integer-input v-model="delivery.add" :min="minAdd"
                                   class="inline"
                                   :disabled="delivery.select!=='2'"
                                   style="width:100px"
                    ></integer-input>天
                </div>
            </el-col>
        </el-row>
        <el-row class="mb-xs">
            <el-col :span="3" class="text-right">
                定时提交修改：
            </el-col>
            <el-col :span="21">
                <el-date-picker
                    v-model="delivery.cron_time"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3" class="text-right">
                修改备注：
            </el-col>
            <el-col :span="21">
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:35%"
                    placeholder="请输入内容"
                    v-model="delivery.remark">
                </el-input>
            </el-col>
        </el-row>
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
                prop="delivery_time"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="delivery"
                label="修改后">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <request-button :mintime="200" req-key="native_keep_submit" :request="keep">保存待同步平台</request-button>
            <el-button size="mini" @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_aliexpress_batch_delivery
    } from "../../../../../api/publish-smt"
	export default{
		data(){
			return {
                show:this.value,
                delivery:{
                    select:"",
                    text:"",
                    add:""
                },
                minAdd:0,
            }
		},
        methods:{
		    open(){
                this.clear();
            },
			clear(){
                this.delivery = {
                    select:"",
                    text:"",
                    add:"",
                    cron_time:"",
                    remark:"",
                };
                this.minAdd = 0;
            },
            close(){
                this.show=false;
            },
            look(){
                if(this.delivery.select===""){
                    this.$reqKey('native_keep_submit',false);
                    this.$message({type:"warning",message:"请选择修改方式"});
                    return  false;
                }
                if(this.delivery.select==="2"){
                    this.selectedIds.forEach(row=>{
                        let delivery=parseInt(row.delivery_time)+Number(this.delivery.add);
                        this.$set(row,"delivery",delivery);
                    });
                }
                if(this.delivery.select==="1"){
                    this.selectedIds.forEach(row=>{
                        this.$set(row,"delivery",this.delivery.text);
                    });
                }
                return true;
            },
            keep(){
                let flag=this.look();
                if(this.delivery.cron_time && this.delivery.cron_time instanceof Object){
                    this.delivery.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.delivery.cron_time/1000);
                }else if(!this.delivery.cron_time){
                    this.delivery.cron_time = "";
                }
                if(flag){
                    let data=[];
                    this.selectedIds.forEach(row=>{
                        data.push({id:row.id,delivery_time:row.delivery})
                    });
                    let params = {
                        data:data,
                        cron_time:this.delivery.cron_time || 0,
                        remark:this.delivery.remark.trim(),
                    };
                    return this.$http(api_aliexpress_batch_delivery,params).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('change-data',data);
                        this.show=false;
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('native_keep_submit',false);
                        },200);
                    });
                }
            },
        },
        watch: {
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit("input",val)
            },
        },
        props:{
			value:{},
            selectedIds:{
            	required:true,
                type:Array,
            }
        },
		components: {
            uiListCheck:require("../../../../../components/ui-list-check.vue").default,
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            integerInput:require("../../../../../components/integer-input.vue").default,
        }
	}
</script>

