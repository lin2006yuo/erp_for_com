<template>
    <div>
        <el-table
            :data="tableData"
            v-resize="{height:41}"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            class="scroll-bar"
            highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                v-if="hasOperatorCol"
                key="row.operator"
                label="操作人员"
                inline-template>
                <ui-tip :content="row.operator" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                v-if="!hasOperatorCol"
                key="row.warehouse.one"
                label="仓库"
                inline-template>
                <ui-tip :content="row.warehouse" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                key="row.times"
                label="上架次数"
                inline-template>
                <ui-tip :content="row.times" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                key="row.type_quantity"
                label="SKU品种数"
                inline-template>
                <ui-tip :content="row.type_quantity" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                key="row.quantity"
                label="SKU总数量"
                inline-template>
                <ui-tip :content="row.quantity" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                v-if="hasOperatorCol"
                key="row.warehouse.tow"
                label="仓库"
                inline-template>
                <ui-tip :content="row.warehouse" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                v-if="!isMonth"
                key="row.dateline"
                label="操作日期"
                inline-template>
                <ui-tip :content="row.dateline" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                v-else
                key="row.dateline"
                label="操作月份"
                inline-template>
                <ui-tip :content="row.dateline" :width="98"></ui-tip>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_shelf_report} from '../../../../api/putaway-statistics'
    export default {
        data() {
            return {
                loading:false,
                tableData:[],
                total:0,
                isMonth: false,
                hasOperatorCol:true
            }
        },
        methods: {
            async init(){
                try {
                    this.loading = true;
                    this.tableData = [];
                    let data = this.deal_time(this.searchData);
                    const res = await this.$http(api_shelf_report,data);
                    this.tableData = res.data;
                    this.total = res.count;
                    this.$emit('can-export', this.tableData.length);
                } catch (code){
                    this.$message({type:"error",message:code.message || code});
                    this.loading = false;
                } finally {
                    this.loading = false;
                }
            },
            //处理年月日
            deal_time(searchData){
                //处理年月日 YYYY-MM-dd
                let data=clone(searchData);
                if(searchData.date_from){
                    data.date_from=datef('YYYY-MM-dd', searchData.date_from/1000);
                }else {
                    data.date_from='';
                }
                if(searchData.date_to){
                    if(this.isMonth){
                        let date = new Date();
                        if(searchData.date_to.getMonth() === date.getMonth()){
                            searchData.date_to = Date.now() - 24*60*60*1000;
                        } else if(searchData.date_to.getMonth() === date.getMonth()-1){
                            //把日期设置为上个月
                            date.setMonth(date.getMonth());
                            //把日期设置为上个月最后一天
                            date.setDate(0);
                            searchData.date_to = date;
                        }else{
                            date = new Date(searchData.date_to);
                            date.setMonth(date.getMonth()+1);
                            date.setDate(0);
                            searchData.date_to = date;
                        }
                    }
                    data.date_to=datef('YYYY-MM-dd', searchData.date_to/1000);
                }else {
                    data.date_to='';
                }
                return data;
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            exports(){
                let data = this.deal_time(this.searchData);
                this.$http(api_export_stock, data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('exports-result', true);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
        },
        computed:{},
        watch: {
            'searchData.group_type':function(val){
                switch (val){
                    case 1:
                        this.isMonth = false;
                        this.hasOperatorCol = true;
                        break;
                    case 2:
                        this.isMonth = true;
                        this.hasOperatorCol = true;
                        break;
                    case 3:
                        this.isMonth = false;
                        this.hasOperatorCol = false;
                        break;
                    case 4:
                        this.isMonth = true;
                        this.hasOperatorCol = false;
                        break;
                }
            }
        },
        props: {
            searchData:{},
            tableColumns:{},
            apiReport:{
                require:true
            },
            emptyText:{
                default(){
                    return '暂无数据';
                }
            }
        },
        components: {
            uiTip:require('../../../../components/ui-tip').default
        }
    }
</script>
