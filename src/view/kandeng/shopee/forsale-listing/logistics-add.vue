<template>
    <page-dialog :title="title" v-model="show" size="large" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <label class="inline text-right ml-sm">账号简称：{{thecode}}，物流方式修改为：</label>
        <el-row class="mt-sm">
            <el-col>
                <table class="template">
                    <tr v-for="(item, index) in tableData">
                        <td>
                            <el-checkbox v-model="item.enable"></el-checkbox>
                        </td>
                        <td class="t-left">{{item.logistic_name}}({{item.weight_limits}})</td>
                        <td>免运费：<el-select class='inline s-width-small' v-model="item.is_free" default-first-option filterable clearable>
                            <el-option
                                v-for="res in option"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                            ></el-option>
                        </el-select>
                        </td>
                    </tr>
                </table>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import  {api_logistics_shopee,api_batch_setting} from "../../../../api/shopee-publish"
    export default{
        data(){
            return{
                show:this.value,
                code:'',
                tableData:[],
                option:[
                    {label:"是",value:1},
                    {label:"否",value:0},
                ]
            }
        },
        methods:{
            open(){
                let list = this.selectedIds.map(row=>{
                    return row.account_id
                });
                list =[...new Set(list)];
                let params = {
                    account_id:list[0]
                };
                this.$http(api_logistics_shopee,params).then(res=>{
                	res = res.map(row=>{
                		let weight_limits = JSON.parse(row.weight_limits);
                		return {
                            enable:!row.enable,
                            logistic_name:row.logistic_name,
                            weight_limits:this.trans_max_min_weight(weight_limits),
                            is_free:0,
                            logistic_id:row.logistic_id
                        }
                    })
                    this.tableData = res
                })
            },
            trans_max_min_weight(row){
                let spliceData = '';
                let max = `最大${row['item_max_weight']}公斤`;
                let min = `最小${row['item_min_weight']}公斤`;
                return spliceData = max+min;
            },
            cloce(){

            },
            keep(){
                let itemId = this.selectedIds.map(item=>{
                	if(item.variation_sku !== undefined){
                		let variat = {
                            variation_sku:item.variation_sku,
                            local_sku:item.local_sku,
                            name:item.name,
                            price:item.price,
                            stock:item.stock,
                            sku_sale_status:item.sku_sale_status,
                        }
                        return variat;
                    }else {
                        return item.item_id
                    }
                });
                let logisticIdList=this.tableData.filter(row=>row.enable).map(res=>{
                    return res.logistic_id
                });
                let list = [];
                itemId.forEach(row=>{
                    logisticIdList.forEach(res=>{
                        let obj
                        if(typeof row === 'object'){
                            obj = {
                                variant_id:row,
                                logistic_id:res
                            }
                        }else{
                            obj = {
                                item_id:row,
                                logistic_id:res
                            }
                        }
                        list.push(obj)
                    })
                });
                let params = {
                    field:'logistics',
                    data:list,
                };
                this.$http(api_batch_setting,params).then(res=>{
                    this.$message({type: "success", message: res.message || res});
                    this.show = false;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
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
            thecode:{
            	type:String
            }
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
