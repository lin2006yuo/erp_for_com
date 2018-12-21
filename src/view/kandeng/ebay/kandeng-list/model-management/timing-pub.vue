<template>
    <page-dialog v-model="show" size="small" title="重上规则设置" @open="open"
                 class="p-batch-edit" :close-on-click-modal="false">
        <el-row class="timing-pub">
            <el-col :span="8" style="text-align: right">
                <label for=""><i class="icon-red">*</i>定时刊登时间(站点)：</label>
            </el-col>
            <el-col :span="16">
                <el-date-picker
                    v-model="timing"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row class="mt-md">
            <el-col :span="8" style="text-align: right">
                <label for=""><i class="icon-red">*</i>定时刊登方式：</label>
            </el-col>
            <el-col :span="16">
                <span>每</span>
                <integer-input v-model="separated" :min="0"
                               class="inline"
                               style="width:100px"
                ></integer-input>
                <span>分钟上传一个刊登</span>
            </el-col>
        </el-row>
        <div class="tips">
            小提示：此处添加定时刊登时间后，可在“刊登队列”中查找到相应的定时队列。
        </div>
        <div slot="footer" class="dialog-footer">
            <request-button @click="keep" req-key="timingPub" :mintime="300">确定</request-button>
            <el-button size="mini" @click.native="close" >关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-batch-edit{
        .timing-pub{
        }
        .pdt-100{
            padding-top:100px;
        }
    }
</style>
<script>
    import {api_bulk_heavy_listing} from "../../../../../api/ebay-kandeng-public-module"
    export default{
        data(){
            return{
                timing:"",
                show:this.value,
                separated:"",
            }
        },
        created(){
        },
        mounted(){

        },
        computed:{
        },
        methods:{
            open(){
                this.timing = "";
                this.separated = "";
            },
            init(){
                this.timing = "";
                this.separated = "";
            },
            keep(){
                let arr =[];
                this.selectIds.forEach(row=>{
                    if( row.isCheck){
                        arr.push(row.id)
                    }
                });
                let data = {
                    ids:arr.join(","),
                    timing:this.timing,
                    replen:2,
                    separated:this.separated,
                };
                this.$http(api_bulk_heavy_listing,data).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    this.show = false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                }).finally(()=>{
                    this.$reqKey('timingPub',false);
                })
            },
            close(){
                this.show=false;
            },
        },
        filters:{
        },
        watch:{
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit("input",val)
            }
        },
        props:{
            value:{},
            selectIds:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog:require("../../../../../components/page-dialog.vue").default,
            integerInput:require("../../../../../components/integer-input.vue").default
        }
    }
</script>
