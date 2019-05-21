<template>
    <div class="c-search-table">
        <el-table
            class="scroll-bar"
            v-resize="{height:75}"
            :data="tableData.lists"
            v-loading="loading"
            @row-click="row_click"
            element-loading-text="玩命加载中..."
            highlight-current-row
        >
            <el-table-column
                    align="center"
                    type="selection"
                    width="30px">
            </el-table-column>
            <el-table-column
                    align="center"
                    inline-template
                    label="订单号"
                    row-key="order_number"
            >
                <div>
                    <ui-tip :content="row.order_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    align="center"
                    label="买家ID"
            >
                <div>
                    <ui-tip :content="row.buyer" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    sortable
                    align="center"
                    width="85px"
                    label="目的地"
                    inline-template
            >
                <div>
                    <ui-tip :content="row.country_cn_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    sortable
                    width="90px"
                    align="center"
                    inline-template
                    label="支付总额">
                <div>{{row.currency_code}} {{row.pay_fee|filterPrice}}</div>
            </el-table-column>
            <el-table-column
                    width="84px"
                    sortable
                    align="center"
                    label="付款时间" inline-template>
                <div>
                    <times v-if="row.pay_status" :time="row.pay_status"></times>
                    <span v-else>未付款</span>
                </div>
            </el-table-column>
            <el-table-column
                    width="145px"
                    inline-template
                    align="center"
                    sortable
                    label="最迟发货时间">
                <div>
                    <time-out :time="row.uploaded_deadline" :cur-status="row.shipping_status"></time-out>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableData.page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="tableData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.totalSize">
        </el-pagination>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default {
        data() {
            return {
                selectRow:"",
                forms:{},
                formData:{},
            }
        },
        filters:{
            filterPrice(val){
                if(val){
                    return parseFloat(val).toFixed(2);
                }else{
                    return "";
                }
            },
        },
        methods:{
            row_click(val){
                this.$emit('row-click',val);
            },
            require_server(val){
                this.$delete(this.forms, val);
                this.$http(api_info, val).then(res=>{
                    this.status_operation(res);
                    this.formData = res.customer.source;
                    this.$nextTick(()=>{
                        this.$set(this.forms,val, res);
                    })
                }).catch(code=>{
                    console.log(code)
                });
                this.get_speed(val);
            },
            handleSizeChange(val){
                this.$emit('handleSizeChange',val);
                this.init()
            },
            handleCurrentChange(val){
                this.$emit('handleCurrentChange',val);
                this.init();
            }
        },
        watch:{
            selectRow(val){
                if(val){
                    this.require_server(val);
                }
            },
        },
        computed:{
            now(){
                return Math.ceil(new Date().getTime() / 1000);
            },
        },
        props:{
            tableData:{},
            loading:{},
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default,
            timeOut:require('../local/time-out.vue').default,
        }
    }
</script>
