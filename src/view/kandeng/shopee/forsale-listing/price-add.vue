<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-row>
            <el-radio v-model="radio" label="1" class="inline ml-sm mb-sm">
                <label class="inline text-right" style="width: 90px;">统一修改为：</label>
                <integer-input v-model="unify" :min="1" class="width-sm inline mr-sm" :disabled="radio!=='1'"></integer-input>
                <el-button size="mini"
                           @click.native="look"
                           type="primary"
                           class="inline ml-sm">预览</el-button>
            </el-radio>
        </el-row>
        <el-row>
            <el-radio v-model="radio" label="2" class="inline ml-sm mb-sm">
                <label class="inline text-right" style="width: 90px;">按金额增加：</label>
                <integer-input v-model="sum" :min="1" class="width-sm inline mr-sm" :disabled="radio!=='2'"></integer-input>
            </el-radio>
        </el-row>
        <el-row  class="mb-sm">
            <el-radio v-model="radio" label="3" class="inline ml-sm mb-sm">
                <label class="inline text-right" style="width: 90px;">按涨幅增加：</label>
                <integer-input v-model="amount" :min="1" class="width-sm inline mr-sm" :disabled="radio!=='3'"></integer-input>
                <span>%</span>
            </el-radio>
        </el-row>
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
                prop="price"
                label="销售价">
            </el-table-column>
            <el-table-column
                inline-template
                label="销售价修改后">
                <integer-input v-model="row.newprice"
                               @blur="blur_width(row.newprice)"
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
                radio: '1',
                unify:'',
                sum:'',
                amount:'',
                show:this.value,

            }
        },
        methods:{
            open(){

            },
            cloce(){

            },
            keep(){
                let datas =[];
                this.selectedIds.forEach(item=>{
                    let dataTable = {
                        item_id:item.item_id,
                        price:item.newprice,
                        variation_id:item.variation_id
                    };
                    datas.push(dataTable);
                })
                let params = {
                    field:'price',
                    data:datas
                }
                this.$http(api_batch_setting,params).then(res=>{
                    this.unify = '',
                    this.sum = '',
                    this.amount = '',
                    this.$message({type: "success", message: res.message || res})
                    this.show=false;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            look(){
                if(this.radio===""){
                    this.$message({type:"warning",message:"请选择修改方式"});
                    return  false;
                }
                switch (this.radio){
                    case "1":
                        this.selectedIds.forEach(row=>{
                            row.newprice = Number(this.unify);
                        })
                        break;
                    case "2":
                        this.selectedIds.forEach(row=>{
                            row.newprice = Number(row.price) + Number(this.sum);
                        })
                        break;
                    case "3":
                        this.selectedIds.forEach(row=>{
                            row.newprice=((parseFloat(row.price))*(1+ Number(this.amount)/100)).toFixed(2);
                        });
                        break;
                }
                return true
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
            title:{
                required:true,
                type:String
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
