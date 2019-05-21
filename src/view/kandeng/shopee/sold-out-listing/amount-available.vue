<template>
    <page-dialog title="批量修改可售量" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <div class="inline ml-sm mb-sm">
            <label class="inline text-right" style="width: 120px;">批量修改可售数为：</label>
            <integer-input v-model="counts" :min="1" class="width-sm inline mr-sm"></integer-input>
            <el-button size="mini"
                       @click.native="look"
                       type="primary"
                       class="inline ml-sm">预览</el-button>
        </div>
        <el-table
            :data="selectedIds"
            class="mt-sm"
            style="width: 100%"
            highlight-current-row>
            <el-table-column
                prop="item_sku"
                label="平台SPU"
            >
            </el-table-column>
            <el-table-column
                prop="variation_sku"
                label="平台SKU"
            >
            </el-table-column>
            <el-table-column
                inline-template
                label="可售量">
                <integer-input v-model="row.stock"
                               @blur="blur_width(row.stock)"
                               :min="1">
                </integer-input>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import  {api_batch_setting} from "../../../../api/shopee-publish"
    export default{
        data(){
            return{
                counts:'',
                show:this.value,
                cloneData:[],
            }
        },
        methods:{
            open(){
                this.counts="";
            },
            cloce(){

            },

            look(){
                this.selectedIds.forEach(row=>{
                    row.stock = Number(this.counts);
                })
            },
            keep(){
                let datas =[];
                this.selectedIds.forEach(item=>{
                    let dataTable = {
                        item_id:item.item_id,
                        stock:item.stock,
                        variation_id:item.variation_id,
                    };
                    datas.push(dataTable);
                })
                let params = {
                    field:'stock',
                    data:datas
                }
                this.$http(api_batch_setting,params).then(res=>{
                    this.counts = '';
                    this.$message({type: "success", message: res.message || res});
                    this.show=false;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            blur_width(val){//----------------失去焦点时
                if(val === '')return this.$message({type:"warning", message:'数量不能为空'});
                if(val <= 0)return this.$message({type:"warning", message:'数量不能小于或等于0'});
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
            selectedIds:{
                required:true,
                type:Array
            },
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
            integerInput:require('../../../../components/integer-input.vue').default,
        }
    }
</script>
