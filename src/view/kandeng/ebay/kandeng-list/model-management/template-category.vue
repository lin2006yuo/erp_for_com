<template>
    <page-dialog v-model="show" size="small" title="修改范本分类" @open="open"
                 class="p-batch-edit" :close-on-click-modal="false">
        <el-row class="template-category auto-add">
            <el-col :span="8" style="text-align: right">
                <label for="">范本分类：</label>
            </el-col>
            <el-col :span="16">
                <el-select v-model="promotion" placeholder="请选择" clearable class="has-inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in promotionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <request-button @click="keep" req-key="templateCategory" :mintime="300">确定</request-button>
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
        .template-category{
            padding-bottom: 240px;
        }
        .tips{
            padding-top: 50px;
            text-align: center;
        }
        .dialog-footer{
            text-align:right;
        }
        .icon-red{
            color: red;
            font-weight :bolder;
            padding: 0px 3px;
        }
    }
</style>
<script>
    import {api_get_cateList,api_up_draft_cate} from '../../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return{
                show:this.value,
                promotion:"",
                promotionList:[],
                page:1,
                size:20,
                total:0,
            }
        },
        methods:{
            open(){
                this.init();
            },
            init(){
            	let data={
                    ebay_account:this.accountId,
                    model_name:"",
                    site:this.siteId,
                    type:2,
                    status:1,
                    page:1,
                };
                this.$http(api_get_cateList,data).then(res=>{
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
            handleSizeChange(val){
                this.searchData.pageSize=val;
                this.init()
            },
            handleCurrentChange(val){
                this.searchData.page=val;
                this.init()
            },
            keep(){
                let model_name="";
                this.promotionList.forEach(x => {
                    if(this.promotion===x.value){
                        model_name = x.label
                    }
                });
                let find = this.promotionList.find(row => {
                    return this.promotion === row.value
                });
                if(!!find){
                    model_name = find.label
                };
                let data = {
                    ids:this.selectIds.map(row => row.id).join(","),
                    name:model_name
                }
                this.$http(api_up_draft_cate,data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit("change-data",data);
                    this.show=false
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code})
                }).finally(()=>{
                    this.$reqKey('templateCategory',false)
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
