<template>
    <page class="p-pay-log">
        <page-dialog  v-model="show" title=" "  :close-on-click-modal="false">
        <el-table
                :data="filterData"
                highlight-current-row
                style="width: 100%"
        >
            <el-table-column label="付款金额" prop="payment_amount" ></el-table-column>
            <el-table-column label="付款时间"  inline-template>
                <span>{{row.payment_time|dataFilter}}</span>
            </el-table-column>
            <el-table-column label="采购员" prop="purchaser" ></el-table-column>

           </el-table>

            <el-pagination
                    class="fr"
                    style="margin: 5px 0 20px 0px;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=page
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size=pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total>
            </el-pagination>
        </page-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
import pageDialog from "../../../components/page-dialog.vue"
    export default{
        data(){
            return{
                show:false,
                page:1,
                pageSize:50
            }
        },
        created(){
        },
        mounted(){
        },
        computed:{
            filterData(){
                let ret = [];
                let index = (this.page-1) * this.pageSize;
                let j = this.pageSize;
                for(let i=index; i< this.payData.length && j>0; i++){
                    let row = this.payData[i];
                    ret.push(row);
                    j = j-1;
                }
                return ret;
                console.log(ret)
            },
            total(){
                return this.payData.length
            }
        },
        methods:{
            handleSizeChange(val){
                this.pageSize=val
            },
            handleCurrentChange(val){
                this.page = val;
            }
        },
        filters:{
            dataFilter(val){
                return datef('YYYY-MM-dd HH:mm:ss',val);
            }
        },
        watch:{
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit('input',val)
            }
        },
        props:{
            value:{},
            payData:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog
        }
    }
</script>