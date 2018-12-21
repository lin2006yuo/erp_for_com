<template>
    <div class="p-turnover-box">
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="集结区号">
                <div>
                    <ui-tip :content="row.sequence_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="80"
                    label="仓库">
                <div>
                    <ui-tip :content="row.warehouse" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="200"
                    :render-header="renderHeader">
                <div>
                    <span class="operate already already"
                          v-for="(item, index) in row.mass_box"
                          @click="mass_click(item)"
                          :key="index + 'already'">{{item}}
                    </span>
                    <span class="operate waiting waiting"
                          v-for="(item, index) in row.no_mass_box"
                          @click="mass_click(item)"
                          :key="index + 'waiting'">{{item}}
                    </span>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="200"
                    label="拣货单号">
                <div>
                    <ui-tip :is-operate="true"
                            :content="row.picking_num"
                            @cur-click="look_picking(row)"
                            :width="98">
                    </ui-tip>
                </div>
            </el-table-column>

            <el-table-column
                    inline-template
                    min-width="100"
                    label="当前集结状态">
                <div>
                    <ui-tip :content="row.work_status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="80"
                    label="更新人">
                <div>
                    <ui-tip :content="row.updater" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="更新时间">
                <div>
                    <ui-tip :content="row.update_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="60"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text"
                               class="operat-color"
                               size="mini"
                               :title="scope.row.can_delete === 0 ? '已集结':''"
                               :disabled="scope.row.can_delete === 0"
                               @click="delete_data(scope.row)">删除
                    </el-button>
                </template>
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
    .p-turnover-box{
        .operat-color{
            color: #69f;
        }
        .already{
            color:#008000;
        }
        .waiting{
            color:#FF0000;
        }
    }

</style>
<script>
    import {api_get_mass, api_delete_mass, api_change_mass} from '../../../api/mass-zone'
    export default {
        data(){
            return {
                loading:false,
                tableData:[],
                total:0,
            }
        },
        mounted(){
        },
        filters:{
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            renderHeader(h, { column }) {
                return h('div',{
                        style:{
                            position:'relative',
                            top:'3px'
                        }
                    },
                    [
                        h('span', {
                            style:{
                                position:'relative',
                                top:'-4px'
                            }
                        },'周转箱号：',),
                        h('div', {
                            style:{
                                width:'24px',
                                height:'16px',
                                display:'inline-block',
                                marginTop:'3px',
                                marginLeft:'5px',
                                background:'#FF0000'
                            }
                        }),
                        h('span', {
                            style:{
                                position:'relative',
                                top:'-4px',
                                marginLeft:'3px'
                            }
                        },'等待集结',),
                        h('div', {
                            style:{
                                width:'24px',
                                height:'16px',
                                display:'inline-block',
                                marginTop:'3px',
                                marginLeft:'5px',
                                background:'#008000'
                            }
                        }),
                        h('span', {
                            style:{
                                position:'relative',
                                top:'-4px',
                                marginLeft:'3px'
                            }
                        },'集结完成',),
                    ]
                );
            },
            init(){
                this.loading = true;
                this.$http(api_get_mass, this.searchData).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error",message:code.message || code});
                })
            },
            delete_data(row){
                if(row.can_delete === 0){
                    this.$message({type:"error",message:'已集结区不能删除！'});
                    return false;
                }
                this.$confirm(`您将删除集结区${row.sequence_number},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_mass, row.id).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.tableData.find((item, index)=>{
                            if(item.id === row.id){
                                this.tableData.splice(index, 1);
                            }
                            return item.id === row.id;
                        });
                        this.total--;
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
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
            look_picking(row){
                let param = {};
                param.id = row.picking_num;
                this.$open('/pickings', param);
            },
            mass_click(item){
                let param = {};
                param.id = item;
                this.$open('/turnover-box', param);
            }
        },
        computed: {},
        watch: {
            newItem(val){
                val.forEach(row=>{
                    if(this.tableData.length < 20){
                        this.tableData.push(row);
                    }
                    this.total++;
                });
            }
        },
        props: {
            searchData:{},
            newItem:{}
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default
        },
    }
</script>
