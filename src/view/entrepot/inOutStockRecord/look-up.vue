<template>
    <el-row class="p-look-up">
        <page-dialog title="查看" :size="pageSize" v-model="lookUpDialog" :close-on-click-modal="false">
            <el-row>
                <el-col :span="9">
                        <label class="inline width-md t-right">仓库：</label>
                        <span>{{form.name}}</span>
                </el-col>
                <el-col :span="15">
                        <label class="inline width-md t-right">状态：</label>
                        <span>{{form.status}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="9">
                        <label class="inline width-md t-right">入库类型：</label>
                        <span>{{form.type}}</span>
                </el-col>
                <el-col :span="15">
                        <label class="inline width-md t-right">来源单号：</label>
                        <span>{{form.original_code}}</span>
                </el-col>
             </el-row>
            <el-row>
                <el-col :span="9">
                    <label class="inline width-md t-right">创建人：</label>
                    <span>{{form.create_name}}</span>
                </el-col>
                <el-col :span="15">
                    <label class="inline width-md t-right">创建时间：</label>
                    <span></span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="9">
                    <label class="inline width-md t-right">审核人：</label>
                    <span>{{form.update_name}}</span>
                </el-col>
                <el-col :span="15">
                    <label class="inline width-md t-right">审核时间：</label>
                    <span>{{form.update_time | filterTime}}</span>
                </el-col>
            </el-row>
            <el-row>
                <div>
                    <el-col :span="24">
                        <label class="inline width-md t-right">备注：</label>
                        <span></span>
                    </el-col>
                </div>
            </el-row>
            <span class="inline ml-sm">产品信息</span>
            <el-table  class="mt-xs" :data="form.detailList" border>
                <el-table-column align="center" prop="sku" label="SKU"></el-table-column>
                <el-table-column align="center" prop="name" label="商品名称"></el-table-column>
                <el-table-column align="center" prop="title" label="Title"></el-table-column>
                <el-table-column align="center" prop="quantity" label="入库数量"></el-table-column>
                <el-table-column align="center" prop="price" label="单价"></el-table-column>
                <el-table-column align="center" prop="remark" label="备注"></el-table-column>
            </el-table>
            <span slot="footer">
                <el-button size="mini" @click.native="lookUpDialog = false">关闭</el-button>
            </span>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
import pageDialog from '../../../components/page-dialog.vue'
    export default{
        data(){
            return {
                lookUpDialog:false,
                pageSize:"large"
            }
        },
        methods:{

        },
        filters:{
            filterTime(val){
                if(val) return datef('YYYY-MM-dd',val*1000);
            }
        },
        mounted(){
            this.lookUpDialog=this.value;
        },
        watch:{
            lookUpDialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.lookUpDialog=val;
            }
        },
        props:{
            form:{
                required:true,
                type:Object
            },
            value:{}
        },
        components: {
            pageDialog
        }
    }
</script>