<template>
    <page-dialog v-model="show" size="small" title="折扣促销设置" @open="open"
                 class="p-batch-edit" :close-on-click-modal="false">
        <el-row class="auto-add">
            <el-col :span="8" style="text-align: right">
                <label for="">促销折扣：</label>
            </el-col>
            <el-col :span="16">
                <el-select v-model="promotion" placeholder="请选择" clearable class="has-inline mr-md" filterable style="width:120px">
                    <el-option v-for="item in promotionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <p class="tips">
            小提示：请确认您的eBay账号开通了商店，否则无法使用折扣。
        </p>
        <div slot="footer" class="dialog-footer">
            <request-button @click="keep" req-key="actionPromition" :mintime="300">确定</request-button>
            <el-button size="mini" @click.native="close" >关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-batch-edit{
        .auto-add{
            padding-top: 20px;
            label{
                line-height 30px;
            }
        }
        .tips{
            padding-top: 50px;
            text-align: center;
        }
        .dialog-footer{
            text-align:center;
        }
        .icon-red{
            color: red;
            font-weight :bolder;
            padding: 0px 3px;
        }
    }
</style>
<script>
    import {api_get_promotion_list} from '../../../../../api/ebay-kandeng-public-module';
    import {api_ebay_promotion} from "../../../../../api/ebay-kandeng-operated"
    export default{
        data(){
            return{
                show:this.value,
                promotion:"",
                promotionList:[],
            }
        },
        created(){
            this.init();
        },
        methods:{
            open(){
                this.init();
            },
            init(){
                let data = {
                    "ebay_account":this.accountId,
                    "model_name":"",
                    "status":1
                }
                this.$http(api_get_promotion_list,data).then(res=>{
                    this.promotionList = res.data.map((item)=>{
                        return {
                            label:item.model_name,
                            value:item.id,
                        }
                    });
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            keep(){
                let arr =[];
                this.selectIds.forEach(row=>{
                    if( row.isCheck){
                        arr.push({
                            id:row.id,
                            promotion_id:this.promotion,
                        })
                    }
                })
                this.$http(api_ebay_promotion,{data:arr}).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    })
                    this.show = false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                }).finally(()=>{
                    this.$reqKey('actionPromition',false);
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
            },
            accountId:{},
            siteId:{}
        },
        components:{
            pageDialog:require("../../../../../components/page-dialog.vue").default
        }
    }
</script>
