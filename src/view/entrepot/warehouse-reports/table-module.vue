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
                v-for="(item, index) in tableColumns"
                :key="`${item.value}-${index}-${item.label}`"
                inline-template
                :label="item.label">
                <ui-tip :content="row[item.value]" :width="98"></ui-tip>
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
    import {http} from '../../../lib/http-plus'
    export default {
        data() {
            return {
                loading:false,
                tableData:[],
                total:0,
            }
        },
        methods: {
            async init(){
                try {
                    this.loading = true;
                    this.tableData = [];
                    let data = this.deal_time(this.searchData);
                    let request = http(Url2(this.apiReport), data);
                    const res = await this.$http(request);
                    this.tableData = res.data;
                    this.total = res.count;
                    if(res.weight_section) {
                        this.$emit('weight-section-change',res.weight_section);
                    }
                    this.$emit('can-export', this.tableData.length);
                } catch (code){
                    this.$message({type:"error",message:code.message || code});
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
                this.isWarehouse ? delete data.operator_id:'';
                this.$http(api_export_stock, data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('exports-result', true);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
        },
        computed:{
            isMonth(){
              return this.searchData.group_type === 2 || this.searchData.group_type === 4;
            },
            isWarehouse(){
                return this.searchData.group_type === 3 || this.searchData.group_type === 4;
            },
        },
        watch: {},
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
            uiTip:require('../../../components/ui-tip').default
        }
    }
</script>
