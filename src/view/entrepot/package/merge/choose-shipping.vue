<template>
    <page-dialog v-model="show" size="large" title="选择物流方式" :close-on-click-modal="false">
        <el-table :data="tableData"
                  ref="table"
                  highlight-current-row
                  :row-class-name="row_class"
                  @row-click="row_click">
            <el-table-column inline-template width="35" row-key="shipping_id">
                <el-checkbox v-model="row.isCheck"></el-checkbox>
            </el-table-column>
            <el-table-column label="运输商代码/名称" inline-template>
                <span>{{row.carrier_name}}</span>
            </el-table-column>
            <el-table-column label="运输方式" prop="shipping_method_name">
            </el-table-column>
            <el-table-column label="运费" prop="cny_amount">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
            <el-button size="mini" @click.native="show = false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_mergeInfo,api_keep_mergeInfo} from '../../../../api/order-local';
    export default{
        data(){
            return{
                show:this.value,
            }
        },
        methods:{
            row_click(row){
            	row.isCheck = true;
            	this.tableData.forEach(it=>{
            		if(it.shipping_id !== row.shipping_id){
            			it.isCheck = false;
                    }
                })
            },
            row_class(row){
                return row.shipping_id === this.selectRow ? 'current-row' : '';
            },
            keep(){
            	let arr = this.tableData.filter(row=>row.isCheck);
            	let shipping_fee ="";
            	let shipping_id = "";
            	arr.forEach(row=>{
                    shipping_fee = row.cny_amount;
                    shipping_id = row.shipping_id;
                })
                let option = {
                    merge:this.merges,
                    shipping_fee:shipping_fee,
                    shipping_id:shipping_id,
                };
                this.$http(api_keep_mergeInfo,this.id,option).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message || res
                    });
                    setTimeout(()=>{
                        this.show = false;
                    },2000);
                    this.$emit("refresh");
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                    setTimeout(()=>{
                        this.show = false;
                    },2000);
                })
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
                if(this.tableData.length){
                    this.tableData[0].isCheck = true;
                    this.selectRow = this.tableData[0].shipping_id;
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            tableData:{
                required:true,
                type:Array
            },
            id:{
            },
            merges:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
