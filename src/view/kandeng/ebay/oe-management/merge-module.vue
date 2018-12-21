<template>
    <page-dialog v-model="show" size="small" title="合并兼容数据"
                 element-loading-text="玩命加载中..." @open="open"
                 class="get-oe-information">
        <p style="padding:0 20px">你将合并Item ID：{{item_id}}的汽车兼容数据！</p>
        <div class="mb-sm mt-sm">
            <span class="label c-r required-sign">新的 OE ID：</span>
            <el-input v-model="number" class="inline" style="width:260px"></el-input>
        </div>
        <div class="mb-sm">
            <span class="label c-r required-sign">Item ID：</span>
            <el-input v-model="item_id" class="inline" style="width:260px"></el-input>
        </div>
        <div class="mb-sm">
            <span class="label">SPU：</span>
            <el-input v-model="spu" class="inline" style="width:260px"></el-input>
        </div>
        <div class="mb-sm">
            <span class="label">工厂型号：</span>
            <el-input v-model="factory_model" class="inline" style="width:260px"></el-input>
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
            width:160px;
            &.c-r span{
                color: red;
            }
        }
    }
</style>
<script>
    import { api_oe_model_merge } from '../../../../api/ebay-kandeng-public-module'
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
                this.item_id = this.selectArr.map(x=>x.item_id).join(",");
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
                let timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                this.loading = true;
                let data = [{
                    number :this.number,
                    item_id :this.item_id,
                    spu:this.spu,
                    factory_model:this.factory_model,
                    oe_ids:this.selectArr.map(x=>x.id).join(","),
                }];
                return this.$http(api_oe_model_merge,{data:data}).then(res=>{
                    data.id = Number(res.data);
                    data.create_time = timestamp;
                    this.$emit("change-data",data[0]);
                    this.loading = false;
                    this.show = false;
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
            selectArr:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
            labelItem:require("../../../../components/label-item.vue").default,
        }
    }
</script>
