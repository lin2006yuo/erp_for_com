<template>
    <div class="p-batch-edit">
        <page-dialog title="批量重上" size="small" @open="open"
                     v-model="show" :close-on-click-modal="false">
            <div class="mt-md">
                <div class="up-tips">
                    <p>eBay禁止一切形式的重复刊登，确定要对已选Listing执行批量重新刊登吗？</p>
                </div>
                <el-row class="auto-add mb-xlg">
                    <el-col :span="8" style="text-align: right">
                        <label for="">重新刊登时间：</label>
                    </el-col>
                    <el-col :span="16">
                        <el-radio class="radio" v-model="replen" label=1>立即重上</el-radio><br />
                        <el-radio class="radio" v-model="replen" label=2>定时重上，执行时间
                            <el-time-select v-model="timing" :disabled="isDisabled"
                                            :picker-options="{
                    start: '00:01',
                    step: '00:10',
                    end: '23:51'
                  }"
                                            placeholder="选择时间"
                                            style="width: 100px;" class="inline">
                            </el-time-select>，<br />
                            <span>每</span>
                            <el-input-number class="inline" size="small"
                                             v-model="separated"
                                             :disabled="isDisabled"
                                             :controls="false"
                                             :min="0"
                                             style="width:100px"
                            ></el-input-number>
                            <span>分钟上传一个刊登</span>
                        </el-radio>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <request-button @click="keep" :mintime='300' req-key="batchOnline">确定</request-button>
                <el-button size="mini" @click.native="close" >关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-batch-edit{
        .up-tips{
            text-align:center
        }
        .mb-xlg{
            padding-bottom:155px;
        }
    }
</style>
<script>
    import {api_bulk_heavy_listing} from "../../../../../api/ebay-kandeng-public-module"
    export default{
        data(){
            return {
                show:false,
                tableData:[],
                timing:"",
                replen:"",
                separated:"",
                isDisabled:true,
            }
        },
        methods: {
            open(){
                this.init();
            },
            init(){
                this.timing = "";
                this.replen = "";
                this.separated = "";
            },
            close(){
                this.show=false;
            },
            //保存
            keep(){
                let arr =[];
                this.tableData.forEach(row=>{
                    if( row.isCheck){
                        arr.push(row.id)
                    }
                })
                let data = {
                    ids:arr.join(","),
                    timing:this.timing,
                    replen:Number(this.replen),
                    separated:this.separated,
                }
                this.$http(api_bulk_heavy_listing,data).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    })
                    this.$emit('change-status',arr)
                    this.show = false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                }).finally(()=>{
                    this.$reqKey('batchOnline',false);
                })
            },
        },
        watch: {
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit("input",val)
            },
            replen(val){
                if(val==="1"){
                    this.isDisabled = true;
                    this.timing = "";
                    this.separated = "";
                } else {
                    this.isDisabled = false;
                }
            },
        },
        props: {
            value:{
            },
        },
        components: {
            pageDialog:require("../../../../../components/page-dialog.vue").default,
            uiListCheck:require("../../../../../components/ui-list-check.vue")
        }
    }
</script>
