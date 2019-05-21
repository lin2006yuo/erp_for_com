<template>
    <page-dialog v-model="show" size="small" :title="title"
                 @open="open"
                 element-loading-text="玩命加载中..."
                 class="get-oe-information">
        <div class="mb-sm mt-sm">
            <span class="label c-r"><span>*</span> OE ID：</span>
            <el-input v-model="number" class="inline"></el-input>
        </div>
        <div class="mb-sm">
            <span class="label c-r"><span>*</span> Item ID：</span>
            <el-input v-model="item_id" class="inline"></el-input>
        </div>
        <div class="mb-sm">
            <span class="label">SPU：</span>
            <el-input v-model="spu" class="inline"></el-input>
        </div>
        <div class="mb-sm">
            <span class="label">工厂型号：</span>
            <el-input v-model="factory_model" class="inline"></el-input>
        </div>
        <div v-if="loading">
            <span class="label"></span>
            数据获取中...
        </div>
        <div slot="footer">
            <el-button type="primary" size="mini" @click="keep" :disabled="loading">确定</el-button>
            <el-button size="mini" @click.native="show=false" :disabled="loading">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .get-oe-information{
        .label{
            display:inline-block;
            text-align:right;
            width:200px;
            &.c-r span{
                color: red;
            }
        }
    }
</style>
<script>
    import { api_ebay_oe_sync } from '../../../../api/ebay-kandeng-public-module'
    export default{
        data(){
            return{
                show:this.value,
                number:"",
                item_id:"",
                spu:"",
                factory_model:"",
                loading:false,
            }
        },
        methods:{
            open(){
                this.number = "";
                this.item_id = "";
                this.spu = "";
                this.factory_model = "";
            },
            keep(){
                if(!this.number){
                    this.$message({type:"info", message:"请输入OE ID"});
                    return ;
                }
                if(!this.item_id){
                    this.$message({type:"info", message:"请输入Item ID"});
                    return ;
                }
                this.loading = true;
                let obj = {
                    number :this.number,
                    item_id :this.item_id,
                    spu:this.spu,
                    factory_model:this.factory_model
                };
                return this.$http(api_ebay_oe_sync,obj).then(res=>{
                    this.$message({type:"success",message: res.message || res});
                    this.show = false;
                    this.loading = false;
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                    this.show = false;
                    this.loading = false;
                });
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
                type:Boolean
            },
            title:{
                required:true,
            }
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
            labelItem:require("../../../../components/label-item.vue").default,
        }
    }
</script>
