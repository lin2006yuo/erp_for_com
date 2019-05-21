<template>
    <page-dialog @open="open" v-model="show" size="large" title="修改单位" :close-on-click-modal="false">
        <div>
            <label style="width: 150px;"> 最小计量单位：</label>
            <el-select v-model="bag.unit" placeholder="请选择" class="inline">
                <el-option
                    :key="item.id"
                    v-for="item in bags"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div class="ml-lg">
            <label style="width: 150px;">销售方式：</label>
            <div class="inline">
                <p>
                    <el-radio v-model="bag.select" :label="0">单个{{bageName}}</el-radio>
                </p>
                <p>
                    <el-radio v-model="bag.select" :label="1">打包销售{{bageName}}</el-radio>
                    <span>每包 <el-input v-model="bag.count" class="inline" :disabled="bag.select!=='1'"></el-input></span>
                </p>
            </div>
        </div>
        <div>
            <p>
                <label class="has-inline text-right" style="width: 90px;"> 定时提交修改：</label>
                <el-date-picker
                    v-model="bag.cron_time"
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
                    v-model="bag.remark">
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
                prop="product_unit_name"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="unit_name"
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
    	api_aliexpress_batch_unit,
        api_aliexpress_productUnit
    } from "../../../../../api/publish-smt"
    export default{
        data(){
            return{
                show:this.value,
                bags:[],
                bag:{
                    unit:"",
                    select:"",
                    count:"",
                    cron_time:"",
                    remark:""
                },
                product_unit_name:""
            }
        },
        created(){
        	this.get_bags()
        },
        methods:{
            open(){
                this.clear();
            },
            get_bags(){
                this.$http(api_aliexpress_productUnit).then(res=>{
                    this.bags=res;
                }).catch(code=>{
                    console.log(code)
                })
            },
            clear(){
                this.bag = {
                    unit:"",
                    select:"",
                    count:"",
                    cron_time:"",
                    remark:""
                };
            },
            look(){
                if(this.bag.unit===""){
                    this.$message({type:"warning",message:"请选择运输单位"})
                    return  false;
                };
                if(this.bag.select===""){
                    this.$message({type:"warning",message:"请选择销售方式"})
                    return  false;
                }
                let find=this.bags.find(row=>{
                    return row.id===this.bag.unit;
                })
                if(!find){
                    return false
                }
                this.product_unit_name = find.name
                this.selectedIds.forEach(row=>{
                    this.$set(row,"unit_name",find.name)
                    this.$set(row,"unit_id",find.id)
                })
                return true
            },
            keep(){
                let flag = this.look();
                if(this.bag.cron_time && this.bag.cron_time instanceof Object){
                    this.bag.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.bag.cron_time/1000);
                }else if(!this.bag.cron_time){
                    this.bag.cron_time = "";
                }
                if (flag) {
                    let data = this.selectedIds.map(row => {
                        return row.id
                    });
                    let postData = {
                        product_ids: data.join(","),
                        product_unit: this.bag.unit,
                        package_type: this.bag.select,
                        num: this.bag.count,
                        cron_time:this.bag.cron_time || 0,
                        remark:this.bag.remark.trim()
                    };
                    this.$http(api_aliexpress_batch_unit, postData).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.$emit('change-data',data,this.product_unit_name)
                        this.show = false
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'})
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
            pageDialog:require('../../../../../components/page-dialog.vue').default
        }
    }
</script>
