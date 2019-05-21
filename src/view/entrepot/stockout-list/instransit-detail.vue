<template>
    <div class="instransit-detail">
        <page-dialog title="在途库存详情" v-model="show" width="50%" :close-on-click-modal="false">
            <div>
                <el-table
                    :data="detailList"
                    highlight-current-row
                    style="width: 100%">
                    <el-table-column
                        label="采购单号"
                        prop="id"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        label="供应商"
                        inline-template>
                        <span :title="row.company_name" class="ellipsis">{{row.company_name}}</span>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        label="结算方式">
                        <div :title="row.balance_type" class="ellipsis">{{row.balance_type}}</div>
                    </el-table-column>
                    <el-table-column
                        label="采购员"
                        inline-template
                        width="80">
                        <span>{{row.purchase_user_id | filterEmpty}}</span>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        label="供应链专员"
                        width="80">
                        <span>{{row.supply_chain_specialist_id | filterEmpty}}</span>
                    </el-table-column>
                    <el-table-column
                        label="运单号"
                        inline-template>
                        <span :title="row.logistics_bill_no" class="ellipsis">{{row.logistics_bill_no | filterEmpty}}</span>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        label="发货日期"
                        prop="delivered_time">
                        <span>{{row.delivered_time | filterEmpty}}</span>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="show=false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue'
    export default{
        data(){
            return {
                show: false
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input',val);
            }
        },
        filters:{
            filterEmpty(val){
                return  val ? val : '- -';
            },
        },
        props:{
            value:{},
            detailList:{
                required:true,
                type:Array
            },
        },
        components:{
            pageDialog
        }
    }
</script>

