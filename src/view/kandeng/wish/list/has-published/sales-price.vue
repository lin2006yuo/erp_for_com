<template>
    <page-dialog v-model="show" @open="open" size="large" title="修改销售价" :close-on-click-modal="false">
        <el-row>
            <el-col :span="2" style="width: 150px">
                <el-radio  v-model="salePrice.select" label="1">统一售价</el-radio>
            </el-col>
            <el-col :span="16">
                <ui-limit-number  v-model="salePrice.price" :limit="2" class="inline">
                </ui-limit-number>
            </el-col>
        </el-row>
        <el-row class="mt-xs">
            <el-col :span="2" style="width: 150px">
                <el-radio  v-model="salePrice.select" label="2">售价涨幅</el-radio>
            </el-col>
            <el-col :span="16">
                <ui-limit-number  v-model="salePrice.increase.value" :limit="2" class="inline">
                </ui-limit-number>
                <span>%</span>
                <el-checkbox v-model="salePrice.increase.isInt">取整</el-checkbox>
                <el-radio  v-model="salePrice.increase.intValue" label="1">进一法</el-radio>
                <el-radio  v-model="salePrice.increase.intValue" label="2">四舍五入法</el-radio>
                <el-radio  v-model="salePrice.increase.intValue" label="3">去尾法</el-radio>
            </el-col>
        </el-row>
        <el-row>
            小提示：如果减少，可输入负数
        </el-row>
        <el-row>
            <el-button size="mini"
                       @click.native="look"
                       type="primary"
                       class="mt-sm mb-sm fr">预览</el-button>
        </el-row>
        <el-table
            :data="selectedIds"
            style="width: 100%">
            <el-table-column
                prop="product_id"
                label="商品ID"
            >
            </el-table-column>
            <el-table-column
                prop="sku"
                label="SKU"
            >
            </el-table-column>
            <el-table-column
                prop="price"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="newPrice"
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
    import {api_wish_batch_edit} from "../../../../../api/kandeng"
    export default{
        data(){
            return{
                show:this.value,
                salePrice:{
                    select:"",
                    price:"",
                    increase:{value:"",isInt:false,intValue:""}
                },
            }
        },
        created(){
        },
        methods:{
            open(){
                this.init();
            },
            init(){
                this.salePrice={
                    select:"",
                    price:"",
                    increase:{value:"",isInt:false,intValue:""}
                };
            },
            look(){
                let flag=true;
                if(!this.salePrice.select){
                    flag=false;
                    this.$message({type:'warning',message:"请选择修改方式"});
                    return;
                }
                switch (this.salePrice.select){
                    case "1":
                        this.selectedIds.forEach((row,index)=>{
                            let newV = parseFloat(this.salePrice.price);
                            let oldV = parseFloat(row.price);
                            if(!!row.is_promoted&&newV>oldV) return this.$message({type:"warning",message:`第${index+1}行，为促销产品，销售价格不允许提高`});
                            this.$set(row,"newPrice", this.salePrice.price)
                        });
                        break;
                    case "2":
                        let getPrice=Number(this.salePrice.increase.value);
                        this.selectedIds.forEach(row=>{
                            let price=0;
                            if(this.salePrice.increase.isInt){
                                if(this.salePrice.increase.intValue==="3"){
                                    price=Math.floor(row.price*(getPrice/100+1));
                                }else if(this.salePrice.increase.intValue==="1"){
                                    price=Math.ceil(row.price*(getPrice/100+1));
                                }else  if(this.salePrice.increase.intValue==="2"){
                                    price=Math.round(row.price*(getPrice/100+1));
                                }else {
                                    flag=false;
                                    this.$message({type:'warning',message:"请选择取整方式"});
                                }
                            }else {
                                price=(row.price*(getPrice/100+1)).toFixed(2);
                            }
                            this.$set(row,"newPrice",price);
                        });
                }
                return flag;
            },
            keep(){
                let b=this.look();
                if(b){
                    let table2=this.selectedIds.map(row=>{
                        return {variant_id:row.variant_id,price:row.newPrice}
                    });
                    let data={type:'price',data:table2};
                    this.$http(api_wish_batch_edit,data).then(res=>{
                        this.show = false;
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('change-data',this.selectedIds.map(row=>{
                            return {variant_id:row.variant_id,shipping_time:row.newShipping_time,};
                        }))
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                };
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
        },
        props:{
            value:{
                required:true,
            },
            selectedIds:{
                require:true,
                type:Array
            }
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default
        }
    }
</script>
